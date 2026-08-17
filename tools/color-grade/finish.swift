import Foundation
import AVFoundation
import CoreImage
import AppKit

// Finishing pass: light noise clean-up, capture sharpening, high-bitrate encode.
// Sharpening must happen AFTER the punch-ins, or the upscaling smears it.

var NR: Double = 0.008      // noise reduction level
var RADIUS: Double = 1.1    // unsharp radius
var INTENSITY: Double = 0.5 // unsharp strength
var MBPS: Double = 40       // output bitrate

func finish(_ input: CIImage) -> CIImage {
    var img = input
    if NR > 0, let f = CIFilter(name: "CINoiseReduction") {
        f.setValue(img, forKey: kCIInputImageKey)
        f.setValue(NR, forKey: "inputNoiseLevel")
        f.setValue(0.40, forKey: "inputSharpness")
        img = f.outputImage ?? img
    }
    if INTENSITY > 0, let f = CIFilter(name: "CIUnsharpMask") {
        f.setValue(img, forKey: kCIInputImageKey)
        f.setValue(RADIUS, forKey: kCIInputRadiusKey)
        f.setValue(INTENSITY, forKey: kCIInputIntensityKey)
        img = f.outputImage ?? img
    }
    return img.cropped(to: input.extent)
}

let a = CommandLine.arguments
guard a.count >= 4 else { print("usage: finish still|video <in> <out> [--nr N] [--radius N] [--amount N] [--mbps N]"); exit(1) }
let mode = a[1], inPath = a[2], outPath = a[3]
var i = 4
while i < a.count {
    switch a[i] {
    case "--nr":     NR = Double(a[i+1]) ?? NR; i += 2
    case "--radius": RADIUS = Double(a[i+1]) ?? RADIUS; i += 2
    case "--amount": INTENSITY = Double(a[i+1]) ?? INTENSITY; i += 2
    case "--mbps":   MBPS = Double(a[i+1]) ?? MBPS; i += 2
    default: i += 1
    }
}
print(String(format: "finish: nr %.3f  radius %.2f  amount %.2f  %.0f Mbps", NR, RADIUS, INTENSITY, MBPS))
let ctx = CIContext()

if mode == "still" {
    guard let img = CIImage(contentsOf: URL(fileURLWithPath: inPath)) else { print("bad input"); exit(1) }
    let out = finish(img)
    guard let cg = ctx.createCGImage(out, from: out.extent) else { print("render failed"); exit(1) }
    try! NSBitmapImageRep(cgImage: cg)
        .representation(using: .jpeg, properties: [.compressionFactor: 0.95])!
        .write(to: URL(fileURLWithPath: outPath))
    print("wrote \(outPath)")
    exit(0)
}

// ---- video: reader -> CoreImage -> writer at a real bitrate ----
let asset = AVURLAsset(url: URL(fileURLWithPath: inPath))
guard let vTrack = asset.tracks(withMediaType: .video).first else { print("no video"); exit(1) }
let size = vTrack.naturalSize
let fps = vTrack.nominalFrameRate

guard let reader = try? AVAssetReader(asset: asset) else { print("reader failed"); exit(1) }
let readOut = AVAssetReaderTrackOutput(track: vTrack, outputSettings: [
    kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA])
reader.add(readOut)

try? FileManager.default.removeItem(atPath: outPath)
guard let writer = try? AVAssetWriter(outputURL: URL(fileURLWithPath: outPath), fileType: .mp4) else {
    print("writer failed"); exit(1)
}
let wIn = AVAssetWriterInput(mediaType: .video, outputSettings: [
    AVVideoCodecKey: AVVideoCodecType.h264,
    AVVideoWidthKey: Int(size.width),
    AVVideoHeightKey: Int(size.height),
    AVVideoCompressionPropertiesKey: [
        AVVideoAverageBitRateKey: Int(MBPS * 1_000_000),
        AVVideoMaxKeyFrameIntervalKey: Int(fps * 2),
        AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
        AVVideoAllowFrameReorderingKey: true,
    ],
])
wIn.expectsMediaDataInRealTime = false
let adaptor = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: wIn, sourcePixelBufferAttributes: [
    kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA,
    kCVPixelBufferWidthKey as String: Int(size.width),
    kCVPixelBufferHeightKey as String: Int(size.height),
])
writer.add(wIn)
writer.startWriting()
writer.startSession(atSourceTime: .zero)
reader.startReading()

let queue = DispatchQueue(label: "finish")
let sem = DispatchSemaphore(value: 0)
var count = 0
wIn.requestMediaDataWhenReady(on: queue) {
    while wIn.isReadyForMoreMediaData {
        guard let sb = readOut.copyNextSampleBuffer(),
              let pb = CMSampleBufferGetImageBuffer(sb) else {
            wIn.markAsFinished()
            writer.finishWriting {
                print(writer.status == .completed
                      ? "exported \(outPath)  (\(count) frames)"
                      : "FAILED: \(String(describing: writer.error))")
                sem.signal()
            }
            return
        }
        let t = CMSampleBufferGetPresentationTimeStamp(sb)
        let out = finish(CIImage(cvPixelBuffer: pb))
        var newPB: CVPixelBuffer?
        CVPixelBufferPoolCreatePixelBuffer(nil, adaptor.pixelBufferPool!, &newPB)
        if let dst = newPB {
            ctx.render(out, to: dst)
            adaptor.append(dst, withPresentationTime: t)
            count += 1
            if count % 300 == 0 { print("  \(count) frames") }
        }
    }
}
sem.wait()
