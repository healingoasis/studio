import Foundation
import AVFoundation
import AppKit
import QuartzCore

// ---------------------------------------------------------------------------
// The edit
// ---------------------------------------------------------------------------
let W: CGFloat = 1920, H: CGFloat = 1080
let FPS: Int32 = 30
let SRC = "/Users/danielrivera/Documents/Claude/Photos:videos/Graded/C8181 GRADED.mp4"

// in-point, source length, speed (1 = real time, 3 = three times slower),
// punch-in, and where in frame to punch
struct Shot {
    let start: Double, len: Double, slow: Double
    let zoom: CGFloat, cx: CGFloat, cy: CGFloat
    let vig: Double            // how hard the frame is shaped on this shot
    let note: String
}
let shots = [
    Shot(start: 52.2, len: 1.0,  slow: 3, zoom: 1.34, cx: 0.40, cy: 0.52, vig: 1.00, note: "COLD OPEN — hands, 3x slow"),
    Shot(start:  4.2, len: 2.6,  slow: 1, zoom: 1.00, cx: 0.50, cy: 0.50, vig: 0.50, note: "reveal — the arena"),
    Shot(start: 33.8, len: 2.2,  slow: 1, zoom: 1.12, cx: 0.45, cy: 0.50, vig: 0.60, note: "the horse walks toward us"),
    Shot(start: 41.2, len: 1.8,  slow: 1, zoom: 1.18, cx: 0.50, cy: 0.50, vig: 0.75, note: "layered — handler in foreground"),
    Shot(start: 48.0, len: 1.6,  slow: 1, zoom: 1.26, cx: 0.45, cy: 0.48, vig: 0.90, note: "first contact"),
    Shot(start: 55.4, len: 1.6,  slow: 3, zoom: 1.34, cx: 0.40, cy: 0.52, vig: 1.00, note: "THE READ — 3x slow, held"),
    Shot(start: 57.8, len: 1.8,  slow: 1, zoom: 1.30, cx: 0.52, cy: 0.50, vig: 0.95, note: "the horse settles"),
    Shot(start: 60.2, len: 2.0,  slow: 1, zoom: 1.18, cx: 0.42, cy: 0.45, vig: 0.80, note: "he turns, done"),
    Shot(start:  8.5, len: 3.0,  slow: 1, zoom: 1.00, cx: 0.50, cy: 0.50, vig: 0.60, note: "tail under the end card"),
]

let comp = AVMutableComposition()
guard let track = comp.addMutableTrack(withMediaType: .video, preferredTrackID: kCMPersistentTrackID_Invalid)
else { print("no track"); exit(1) }
let srcAsset = AVURLAsset(url: URL(fileURLWithPath: SRC))
guard let sv = srcAsset.tracks(withMediaType: .video).first else { print("no source"); exit(1) }

let TS: Int32 = 600
func ct(_ s: Double) -> CMTime { CMTime(seconds: s, preferredTimescale: TS) }

struct Placed { let startK: Int64, durK: Int64; let shot: Shot }
var placed: [Placed] = []
var cursor: Int64 = 0

for s in shots {
    let outLen = s.len * s.slow
    do {
        try track.insertTimeRange(CMTimeRange(start: ct(s.start), duration: ct(s.len)),
                                  of: sv, at: CMTime(value: cursor, timescale: TS))
    } catch { print("insert failed: \(error)"); exit(1) }
    if s.slow != 1 {
        track.scaleTimeRange(CMTimeRange(start: CMTime(value: cursor, timescale: TS), duration: ct(s.len)),
                             toDuration: ct(outLen))
    }
    let durK = Int64((outLen * Double(TS)).rounded())
    placed.append(Placed(startK: cursor, durK: durK, shot: s))
    print(String(format: "  %5.1fs  %@", outLen, s.note))
    cursor += durK
}
let totalK = cursor
let total = Double(totalK) / Double(TS)
print(String(format: "cut runs %.1fs from %.1fs of rushes", total, shots.reduce(0) { $0 + $1.len }))

// punch-in: put source point (cx,cy) at the centre of frame, scaled by zoom
func punch(_ s: Shot) -> CGAffineTransform {
    let z = max(1.0, s.zoom)
    let lo = 1.0 / (2 * z), hi = 1 - 1.0 / (2 * z)
    let cx = min(max(s.cx, lo), hi), cy = min(max(s.cy, lo), hi)
    return CGAffineTransform(translationX: -cx * W, y: -cy * H)
        .concatenating(CGAffineTransform(scaleX: z, y: z))
        .concatenating(CGAffineTransform(translationX: W / 2, y: H / 2))
}

var instructions: [AVMutableVideoCompositionInstruction] = []
for p in placed {
    let li = AVMutableVideoCompositionLayerInstruction(assetTrack: track)
    li.setTransform(punch(p.shot), at: CMTime(value: p.startK, timescale: TS))
    let inst = AVMutableVideoCompositionInstruction()
    inst.timeRange = CMTimeRange(start: CMTime(value: p.startK, timescale: TS),
                                 duration: CMTime(value: p.durK, timescale: TS))
    inst.layerInstructions = [li]
    instructions.append(inst)
}

let vc = AVMutableVideoComposition()
vc.renderSize = CGSize(width: W, height: H)
vc.frameDuration = CMTime(value: 1, timescale: FPS)
vc.instructions = instructions

// grade every frame through the same S-Log3 LUT, then the titles on top
let videoLayer = CALayer(); videoLayer.frame = CGRect(x: 0, y: 0, width: W, height: H)
let parent = CALayer();     parent.frame     = CGRect(x: 0, y: 0, width: W, height: H)
parent.addSublayer(videoLayer)

func layer(_ path: String) -> CALayer? {
    guard let d = NSData(contentsOfFile: path), let s = CGImageSourceCreateWithData(d, nil),
          let cg = CGImageSourceCreateImageAtIndex(s, 0, nil) else { return nil }
    let l = CALayer(); l.frame = CGRect(x: 0, y: 0, width: W, height: H); l.contents = cg
    return l
}
let easeInOut = CAMediaTimingFunction(name: .easeInEaseOut)
func fade(_ l: CALayer, _ inT: Double, _ outT: Double, _ f: Double) {
    l.opacity = 0
    let d = outT - inT
    let a = CAKeyframeAnimation(keyPath: "opacity")
    a.values = [0, 1, 1, 0] as [NSNumber]
    a.keyTimes = [0, NSNumber(value: min(f, d/3)/d), NSNumber(value: 1 - min(f, d/3)/d), 1]
    a.timingFunctions = [easeInOut, easeInOut, easeInOut]
    a.beginTime = AVCoreAnimationBeginTimeAtZero + inT
    a.duration = d
    a.isRemovedOnCompletion = false; a.fillMode = .both
    l.add(a, forKey: "op"); parent.addSublayer(l)
}

// black at the very top, so it opens out of darkness rather than snapping on
if let blk = layer("edit_black.png") {
    blk.opacity = 1
    let a = CAKeyframeAnimation(keyPath: "opacity")
    a.values = [1, 0] as [NSNumber]; a.keyTimes = [0, 1]
    a.timingFunctions = [easeInOut]
    a.beginTime = AVCoreAnimationBeginTimeAtZero
    a.duration = 1.0
    a.isRemovedOnCompletion = false; a.fillMode = .both
    blk.add(a, forKey: "op"); parent.addSublayer(blk)
}
if let v = layer("edit_vig.png") {
    var times: [NSNumber] = [0]
    var vals:  [NSNumber] = [NSNumber(value: shots[0].vig)]
    for (i, p) in placed.enumerated() {
        let mid = (Double(p.startK) + Double(p.durK) / 2) / Double(TS)
        times.append(NSNumber(value: mid / total))
        vals.append(NSNumber(value: shots[i].vig))
    }
    times.append(1); vals.append(NSNumber(value: shots[shots.count-1].vig))
    let a = CAKeyframeAnimation(keyPath: "opacity")
    a.values = vals; a.keyTimes = times
    a.beginTime = AVCoreAnimationBeginTimeAtZero
    a.duration = total
    a.isRemovedOnCompletion = false; a.fillMode = .both
    v.opacity = 0
    v.add(a, forKey: "vig")
    parent.addSublayer(v)
}
if let t = layer("edit_title.png") { fade(t, 3.4, 7.2, 0.7) }
let tail = placed[placed.count - 1]
let tailStart = Double(tail.startK) / Double(TS)
if let e = layer("edit_end.png") { fade(e, tailStart, total, 0.6) }

vc.animationTool = AVVideoCompositionCoreAnimationTool(postProcessingAsVideoLayer: videoLayer, in: parent)

let outPath = CommandLine.arguments.count > 1 ? CommandLine.arguments[1] : "edit.mp4"
try? FileManager.default.removeItem(atPath: outPath)
guard let ex = AVAssetExportSession(asset: comp, presetName: AVAssetExportPresetHighestQuality) else {
    print("no export session"); exit(1)
}
ex.outputURL = URL(fileURLWithPath: outPath)
ex.outputFileType = .mp4
ex.videoComposition = vc
let sem = DispatchSemaphore(value: 0)
let timer = DispatchSource.makeTimerSource(queue: .global())
timer.schedule(deadline: .now() + 10, repeating: 10)
timer.setEventHandler { print("  \(Int(ex.progress * 100))%") }
timer.resume()
ex.exportAsynchronously {
    timer.cancel()
    switch ex.status {
    case .completed: print("exported \(outPath)")
    case .failed:    print("FAILED: \(String(describing: ex.error))")
    default:         print("status \(ex.status.rawValue)")
    }
    sem.signal()
}
sem.wait()
