import Foundation
import AVFoundation
import AppKit
import QuartzCore

let W: CGFloat = 1080, H: CGFloat = 1920
let FPS: Int32 = 30
let SRC = "/Users/danielrivera/Documents/Claude/Photos:videos/VSMT "

struct Seg { let file: String; let start: Double; let dur: Double }
let segs = [
    Seg(file: "IMG_8751", start: 3.0, dur: 4.2),
    Seg(file: "IMG_7112", start: 1.6, dur: 3.6),
    Seg(file: "IMG_5127", start: 3.0, dur: 3.4),
    Seg(file: "IMG_7087", start: 4.0, dur: 3.4),
    Seg(file: "IMG_8760", start: 2.0, dur: 5.4),
]

struct Ov { let name: String; let inT: Double; let outT: Double; let fade: Double }
let ovs = [
    Ov(name: "mark",  inT: 0.0,  outT: 17.0, fade: 0.35),
    Ov(name: "title", inT: 0.3,  outT: 4.05, fade: 0.45),
    Ov(name: "c1",    inT: 4.5,  outT: 7.65, fade: 0.35),
    Ov(name: "c2",    inT: 8.1,  outT: 11.05, fade: 0.35),
    Ov(name: "c3",    inT: 11.5, outT: 14.45, fade: 0.35),
    Ov(name: "c4",    inT: 14.9, outT: 16.95, fade: 0.35),
    Ov(name: "end",   inT: 17.0, outT: 20.0, fade: 0.35),
]

let comp = AVMutableComposition()
guard let vTrack = comp.addMutableTrack(withMediaType: .video,
        preferredTrackID: kCMPersistentTrackID_Invalid) else { exit(1) }

var instructions: [AVMutableVideoCompositionInstruction] = []
var cursor = CMTime.zero

for s in segs {
    let asset = AVURLAsset(url: URL(fileURLWithPath: "\(SRC)/\(s.file).MOV"))
    guard let src = asset.tracks(withMediaType: .video).first else {
        print("no video track \(s.file)"); exit(1)
    }
    let range = CMTimeRange(start: CMTime(seconds: s.start, preferredTimescale: 600),
                            duration: CMTime(seconds: s.dur, preferredTimescale: 600))
    do { try vTrack.insertTimeRange(range, of: src, at: cursor) }
    catch { print("insert failed \(s.file): \(error)"); exit(1) }

    // aspect-fill transform into W x H
    let t = src.preferredTransform
    let rect = CGRect(origin: .zero, size: src.naturalSize).applying(t)
    let dw = abs(rect.width), dh = abs(rect.height)
    let scale = max(W / dw, H / dh)
    let sw = dw * scale, sh = dh * scale
    let final = t
        .concatenating(CGAffineTransform(translationX: -rect.minX, y: -rect.minY))
        .concatenating(CGAffineTransform(scaleX: scale, y: scale))
        .concatenating(CGAffineTransform(translationX: (W - sw) / 2, y: (H - sh) / 2))

    let li = AVMutableVideoCompositionLayerInstruction(assetTrack: vTrack)
    li.setTransform(final, at: cursor)
    let inst = AVMutableVideoCompositionInstruction()
    inst.timeRange = CMTimeRange(start: cursor, duration: range.duration)
    inst.layerInstructions = [li]
    instructions.append(inst)

    print(String(format: "%@ natural %.0fx%.0f -> display %.0fx%.0f scale %.3f",
                 s.file, src.naturalSize.width, src.naturalSize.height, dw, dh, scale))
    cursor = CMTimeAdd(cursor, range.duration)
}

let total = CMTimeGetSeconds(cursor)
print(String(format: "timeline %.2fs", total))

let vc = AVMutableVideoComposition()
vc.renderSize = CGSize(width: W, height: H)
vc.frameDuration = CMTime(value: 1, timescale: FPS)
vc.instructions = instructions

// ---- Core Animation overlays ----
let videoLayer = CALayer()
videoLayer.frame = CGRect(x: 0, y: 0, width: W, height: H)
let parent = CALayer()
parent.frame = CGRect(x: 0, y: 0, width: W, height: H)
parent.addSublayer(videoLayer)

func loadCG(_ path: String) -> CGImage? {
    guard let d = NSData(contentsOfFile: path),
          let src = CGImageSourceCreateWithData(d, nil) else { return nil }
    return CGImageSourceCreateImageAtIndex(src, 0, nil)
}

for o in ovs {
    guard let img = loadCG("ov/\(o.name).png") else { print("missing ov/\(o.name).png"); exit(1) }
    let l = CALayer()
    l.frame = CGRect(x: 0, y: 0, width: W, height: H)
    l.contents = img
    l.contentsGravity = .resizeAspect
    l.opacity = 0

    let a = CAKeyframeAnimation(keyPath: "opacity")
    let d = o.outT - o.inT
    let f = min(o.fade, d / 2.5)
    a.values = [0, 1, 1, 0] as [NSNumber]
    a.keyTimes = [0, NSNumber(value: f / d), NSNumber(value: 1 - f / d), 1]
    a.beginTime = AVCoreAnimationBeginTimeAtZero + o.inT
    a.duration = d
    a.isRemovedOnCompletion = false
    a.fillMode = .both
    l.add(a, forKey: "op")
    parent.addSublayer(l)
}

vc.animationTool = AVVideoCompositionCoreAnimationTool(
    postProcessingAsVideoLayer: videoLayer, in: parent)

// ---- export ----
let outPath = CommandLine.arguments.count > 1 ? CommandLine.arguments[1] : "vsmt_reel.mp4"
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
    case .cancelled: print("cancelled")
    default:         print("status \(ex.status.rawValue)")
    }
    sem.signal()
}
sem.wait()
