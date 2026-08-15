import Foundation
import AVFoundation
import AppKit
import QuartzCore

let W: CGFloat = 1080, H: CGFloat = 1920
let FPS: Int32 = 30
let SRC = "/Users/danielrivera/Documents/Claude/Photos:videos/Conference "

// file, in-point, length, caption overlay, zoom direction (+1 push in, -1 pull out)
struct Seg { let file: String; let start: Double; let dur: Double; let cap: String; let zoom: Int }
let segs = [
    Seg(file: "C3834", start: 36.0,  dur: 1.90, cap: "q01", zoom:  1),
    Seg(file: "C3816", start: 2.50,  dur: 1.30, cap: "q02", zoom: -1),
    Seg(file: "C3844", start: 15.0,  dur: 1.30, cap: "q03", zoom:  1),
    Seg(file: "C3818", start: 32.0,  dur: 1.20, cap: "q04", zoom: -1),
    Seg(file: "C3804", start: 20.0,  dur: 1.20, cap: "q05", zoom:  1),
    Seg(file: "C3842", start: 14.0,  dur: 1.20, cap: "q06", zoom: -1),
    Seg(file: "C3814", start: 141.0, dur: 1.20, cap: "q07", zoom:  1),
    Seg(file: "C3826", start: 38.0,  dur: 1.20, cap: "q08", zoom: -1),
    Seg(file: "C3832", start: 4.00,  dur: 1.20, cap: "q09", zoom:  1),
    Seg(file: "C3812", start: 105.0, dur: 1.30, cap: "q10", zoom: -1),
    Seg(file: "C3806", start: 38.0,  dur: 1.20, cap: "q11", zoom:  1),
    Seg(file: "C3816", start: 7.50,  dur: 2.10, cap: "q12", zoom: -1),
]
let END_DUR = 3.5
let ZOOM: CGFloat = 1.075

let comp = AVMutableComposition()
guard let vTrack = comp.addMutableTrack(withMediaType: .video,
        preferredTrackID: kCMPersistentTrackID_Invalid) else { exit(1) }

func zoomAbout(_ z: CGFloat) -> CGAffineTransform {
    CGAffineTransform(translationX: -W/2, y: -H/2)
        .concatenating(CGAffineTransform(scaleX: z, y: z))
        .concatenating(CGAffineTransform(translationX: W/2, y: H/2))
}

var instructions: [AVMutableVideoCompositionInstruction] = []
var cursor = CMTime.zero
var capTimes: [(String, Double, Double)] = []   // name, in, out

for s in segs {
    let asset = AVURLAsset(url: URL(fileURLWithPath: "\(SRC)/\(s.file).MP4"))
    guard let src = asset.tracks(withMediaType: .video).first else {
        print("no video track \(s.file)"); exit(1)
    }
    let range = CMTimeRange(start: CMTime(seconds: s.start, preferredTimescale: 600),
                            duration: CMTime(seconds: s.dur, preferredTimescale: 600))
    do { try vTrack.insertTimeRange(range, of: src, at: cursor) }
    catch { print("insert failed \(s.file): \(error)"); exit(1) }

    let t = src.preferredTransform
    let rect = CGRect(origin: .zero, size: src.naturalSize).applying(t)
    let dw = abs(rect.width), dh = abs(rect.height)
    let scale = max(W / dw, H / dh)
    let sw = dw * scale, sh = dh * scale
    let base = t
        .concatenating(CGAffineTransform(translationX: -rect.minX, y: -rect.minY))
        .concatenating(CGAffineTransform(scaleX: scale, y: scale))
        .concatenating(CGAffineTransform(translationX: (W - sw) / 2, y: (H - sh) / 2))

    let z0: CGFloat = s.zoom > 0 ? 1.0 : ZOOM
    let z1: CGFloat = s.zoom > 0 ? ZOOM : 1.0
    let li = AVMutableVideoCompositionLayerInstruction(assetTrack: vTrack)
    li.setTransformRamp(fromStart: base.concatenating(zoomAbout(z0)),
                        toEnd:     base.concatenating(zoomAbout(z1)),
                        timeRange: CMTimeRange(start: cursor, duration: range.duration))
    let inst = AVMutableVideoCompositionInstruction()
    inst.timeRange = CMTimeRange(start: cursor, duration: range.duration)
    inst.layerInstructions = [li]
    instructions.append(inst)

    let t0 = CMTimeGetSeconds(cursor)
    capTimes.append((s.cap, t0 == 0 ? 0.0 : t0 + 0.10, t0 + s.dur - 0.06))
    cursor = CMTimeAdd(cursor, range.duration)
}

// hold the last frame for the end card by extending the final clip
let endStart = CMTimeGetSeconds(cursor)
if let last = segs.last {
    let asset = AVURLAsset(url: URL(fileURLWithPath: "\(SRC)/\(last.file).MP4"))
    if let src = asset.tracks(withMediaType: .video).first {
        let r = CMTimeRange(start: CMTime(seconds: last.start + last.dur, preferredTimescale: 600),
                            duration: CMTime(seconds: END_DUR, preferredTimescale: 600))
        try? vTrack.insertTimeRange(r, of: src, at: cursor)
        let t = src.preferredTransform
        let rect = CGRect(origin: .zero, size: src.naturalSize).applying(t)
        let dw = abs(rect.width), dh = abs(rect.height)
        let scale = max(W / dw, H / dh)
        let base = t
            .concatenating(CGAffineTransform(translationX: -rect.minX, y: -rect.minY))
            .concatenating(CGAffineTransform(scaleX: scale, y: scale))
            .concatenating(CGAffineTransform(translationX: (W - dw*scale)/2, y: (H - dh*scale)/2))
        let li = AVMutableVideoCompositionLayerInstruction(assetTrack: vTrack)
        li.setTransform(base, at: cursor)
        let inst = AVMutableVideoCompositionInstruction()
        inst.timeRange = CMTimeRange(start: cursor, duration: r.duration)
        inst.layerInstructions = [li]
        instructions.append(inst)
        cursor = CMTimeAdd(cursor, r.duration)
    }
}

print(String(format: "timeline %.2fs (end card at %.2fs)", CMTimeGetSeconds(cursor), endStart))

let vc = AVMutableVideoComposition()
vc.renderSize = CGSize(width: W, height: H)
vc.frameDuration = CMTime(value: 1, timescale: FPS)
vc.instructions = instructions

let videoLayer = CALayer()
videoLayer.frame = CGRect(x: 0, y: 0, width: W, height: H)
let parent = CALayer()
parent.frame = CGRect(x: 0, y: 0, width: W, height: H)
parent.addSublayer(videoLayer)

func loadCG(_ path: String) -> CGImage? {
    guard let d = NSData(contentsOfFile: path),
          let s = CGImageSourceCreateWithData(d, nil) else { return nil }
    return CGImageSourceCreateImageAtIndex(s, 0, nil)
}

func addOverlay(_ name: String, _ inT: Double, _ outT: Double, fade: Double) {
    guard let img = loadCG("ov3/\(name).png") else { print("missing ov2/\(name).png"); exit(1) }
    let l = CALayer()
    l.frame = CGRect(x: 0, y: 0, width: W, height: H)
    l.contents = img
    l.opacity = 0
    let d = outT - inT
    let f = min(fade, d / 3.0)
    let a = CAKeyframeAnimation(keyPath: "opacity")
    a.values = [0, 1, 1, 0] as [NSNumber]
    a.keyTimes = [0, NSNumber(value: f / d), NSNumber(value: 1 - f / d), 1]
    a.beginTime = AVCoreAnimationBeginTimeAtZero + inT
    a.duration = d
    a.isRemovedOnCompletion = false
    a.fillMode = .both
    l.add(a, forKey: "op")
    parent.addSublayer(l)
}

for (i, (name, inT, outT)) in capTimes.enumerated() {
    addOverlay(name, inT, outT, fade: i == 0 ? 0.12 : 0.18)
}
addOverlay("qend", endStart, endStart + END_DUR, fade: 0.30)

vc.animationTool = AVVideoCompositionCoreAnimationTool(
    postProcessingAsVideoLayer: videoLayer, in: parent)

let outPath = CommandLine.arguments.count > 1 ? CommandLine.arguments[1] : "conf_reel.mp4"
try? FileManager.default.removeItem(atPath: outPath)

guard let ex = AVAssetExportSession(asset: comp, presetName: AVAssetExportPresetHighestQuality) else {
    print("no export session"); exit(1)
}
ex.outputURL = URL(fileURLWithPath: outPath)
ex.outputFileType = .mp4
ex.videoComposition = vc
ex.shouldOptimizeForNetworkUse = true

let sem = DispatchSemaphore(value: 0)
ex.exportAsynchronously {
    switch ex.status {
    case .completed: print("exported \(outPath)")
    case .failed:    print("FAILED: \(String(describing: ex.error))")
    default:         print("status \(ex.status.rawValue)")
    }
    sem.signal()
}
sem.wait()
