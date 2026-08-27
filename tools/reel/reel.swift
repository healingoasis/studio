// Assembles a vertical reel from a shot list plus pre-rendered PNG overlays.
//
// There is no ffmpeg on this machine, so this reads each source with
// AVAssetReader, scales to 1080x1920, composites an optional overlay PNG, and
// writes one H.264 file with AVAssetWriter.
//
//   swiftc -O -o reel reel.swift
//   ./reel shots.json out.mp4
//
// shots.json: [{ "file": "...", "in": 2.0, "dur": 2.2, "overlay": "a.png",
//                "speed": 1.0, "hold": false }]
// A shot with "hold": true and no file is a full-frame still card (overlay only).

import AVFoundation
import CoreImage
import Foundation

let W = 1080, H = 1920, FPS: Int32 = 30
let ctx = CIContext()

struct Shot: Decodable {
    var file: String?
    var `in`: Double?
    var dur: Double
    var overlay: String?
    var speed: Double?
    var hold: Bool?
}

let args = CommandLine.arguments
guard args.count >= 3 else { print("usage: reel shots.json out.mp4 [kbps]"); exit(1) }
let kbps = args.count > 3 ? (Int(args[3]) ?? 9000) : 9000
let shots = try! JSONDecoder().decode([Shot].self, from: Data(contentsOf: URL(fileURLWithPath: args[1])))
let outURL = URL(fileURLWithPath: args[2])
try? FileManager.default.removeItem(at: outURL)

let writer = try! AVAssetWriter(outputURL: outURL, fileType: .mp4)
let settings: [String: Any] = [
    AVVideoCodecKey: AVVideoCodecType.h264,
    AVVideoWidthKey: W, AVVideoHeightKey: H,
    AVVideoCompressionPropertiesKey: [
        AVVideoAverageBitRateKey: kbps * 1000,
        AVVideoMaxKeyFrameIntervalKey: 30,
        AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
    ],
]
let input = AVAssetWriterInput(mediaType: .video, outputSettings: settings)
input.expectsMediaDataInRealTime = false
let adaptor = AVAssetWriterInputPixelBufferAdaptor(
    assetWriterInput: input,
    sourcePixelBufferAttributes: [
        kCVPixelBufferPixelFormatTypeKey as String: Int(kCVPixelFormatType_32BGRA),
        kCVPixelBufferWidthKey as String: W, kCVPixelBufferHeightKey as String: H,
    ])
writer.add(input)
writer.startWriting()
writer.startSession(atSourceTime: .zero)

func loadPNG(_ p: String) -> CIImage? {
    guard let d = FileManager.default.contents(atPath: p) else { return nil }
    return CIImage(data: d)
}

// Fill the 1080x1920 frame: scale to cover, then centre-crop.
func fit(_ img: CIImage) -> CIImage {
    let e = img.extent
    let s = max(CGFloat(W) / e.width, CGFloat(H) / e.height)
    var out = img.transformed(by: CGAffineTransform(scaleX: s, y: s))
    let dx = (out.extent.width - CGFloat(W)) / 2, dy = (out.extent.height - CGFloat(H)) / 2
    out = out.transformed(by: CGAffineTransform(translationX: -out.extent.origin.x - dx,
                                                y: -out.extent.origin.y - dy))
    return out.cropped(to: CGRect(x: 0, y: 0, width: W, height: H))
}

// A gentle grade so phone footage from several rooms cuts together.
func grade(_ img: CIImage) -> CIImage {
    let c = CIFilter(name: "CIColorControls")!
    c.setValue(img, forKey: kCIInputImageKey)
    c.setValue(1.06, forKey: kCIInputContrastKey)
    c.setValue(1.10, forKey: kCIInputSaturationKey)
    c.setValue(0.01, forKey: kCIInputBrightnessKey)
    var out = c.outputImage!
    let v = CIFilter(name: "CIVignette")!
    v.setValue(out, forKey: kCIInputImageKey)
    v.setValue(1.1, forKey: kCIInputIntensityKey)
    v.setValue(1.9, forKey: kCIInputRadiusKey)
    out = v.outputImage!
    return out.cropped(to: CGRect(x: 0, y: 0, width: W, height: H))
}

var pool: CVPixelBufferPool?
CVPixelBufferPoolCreate(nil, nil, [
    kCVPixelBufferPixelFormatTypeKey as String: Int(kCVPixelFormatType_32BGRA),
    kCVPixelBufferWidthKey as String: W, kCVPixelBufferHeightKey as String: H,
    kCVPixelBufferIOSurfacePropertiesKey as String: [:],
] as CFDictionary, &pool)

var frameIndex: Int64 = 0
func emit(_ image: CIImage) {
    var pb: CVPixelBuffer?
    CVPixelBufferPoolCreatePixelBuffer(nil, pool!, &pb)
    guard let buf = pb else { return }
    ctx.render(image, to: buf)
    while !input.isReadyForMoreMediaData { usleep(4000) }
    adaptor.append(buf, withPresentationTime: CMTime(value: frameIndex, timescale: FPS))
    frameIndex += 1
}

let black = CIImage(color: CIColor(red: 0.02, green: 0.02, blue: 0.02))
    .cropped(to: CGRect(x: 0, y: 0, width: W, height: H))

for (n, shot) in shots.enumerated() {
    let frames = Int((shot.dur * Double(FPS)).rounded())
    let overlay = shot.overlay.flatMap { loadPNG($0) }

    if shot.hold == true || shot.file == nil {
        let base = overlay.map { $0.composited(over: black) } ?? black
        for _ in 0..<frames { emit(base) }
        FileHandle.standardError.write("card \(n + 1): \(frames)f\n".data(using: .utf8)!)
        continue
    }

    let url = URL(fileURLWithPath: shot.file!)
    let asset = AVURLAsset(url: url)
    guard let track = asset.tracks(withMediaType: .video).first else { continue }
    let speed = shot.speed ?? 1.0
    let start = shot.in ?? 0
    let reader = try! AVAssetReader(asset: asset)
    reader.timeRange = CMTimeRange(start: CMTime(seconds: start, preferredTimescale: 600),
                                   duration: CMTime(seconds: shot.dur * speed + 0.5, preferredTimescale: 600))
    let out = AVAssetReaderTrackOutput(track: track, outputSettings: [
        kCVPixelBufferPixelFormatTypeKey as String: Int(kCVPixelFormatType_32BGRA)])
    reader.add(out)
    reader.startReading()

    // preferredTransform assumes a top-left origin; Core Image uses bottom-left,
    // so applying it raw flips the frame. Convert it to an EXIF orientation and
    // let CIImage.oriented do the work correctly.
    let t = track.preferredTransform
    let orientation: Int32
    switch (t.a, t.b, t.c, t.d) {
    case (0, 1, -1, 0):   orientation = 6   // 90 clockwise
    case (-1, 0, 0, -1):  orientation = 3   // 180
    case (0, -1, 1, 0):   orientation = 8   // 90 counter-clockwise
    default:              orientation = 1   // already upright
    }
    var written = 0, srcIndex = 0
    let step = speed  // take every `speed`-th source frame for slow motion
    var acc = 0.0
    var last: CIImage? = nil

    while written < frames, let sb = out.copyNextSampleBuffer() {
        guard let pb = CMSampleBufferGetImageBuffer(sb) else { continue }
        var img = CIImage(cvPixelBuffer: pb).oriented(forExifOrientation: orientation)
        img = grade(fit(img))
        last = img
        srcIndex += 1
        acc += 1.0
        while acc >= step, written < frames {
            var f = img
            if let o = overlay { f = o.composited(over: f) }
            emit(f); written += 1; acc -= step
        }
    }
    // If the source ran short, hold the final frame rather than cutting early.
    while written < frames, let l = last {
        var f = l
        if let o = overlay { f = o.composited(over: f) }
        emit(f); written += 1
    }
    FileHandle.standardError.write("shot \(n + 1): \(written)f from \(url.lastPathComponent)\n".data(using: .utf8)!)
}

input.markAsFinished()
let sem = DispatchSemaphore(value: 0)
writer.finishWriting { sem.signal() }
sem.wait()
print(String(format: "%.1fs  %@", Double(frameIndex) / Double(FPS), outURL.path))
