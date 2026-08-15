import Foundation
import AVFoundation
import AppKit
import QuartzCore

let W: CGFloat = 1080, H: CGFloat = 1920
let FPS: Int32 = 60
let SRC = "/Users/danielrivera/Documents/Claude/Photos:videos/Conference "
let T = 0.28                 // cross-dissolve length
let ZOOM: CGFloat = 1.055    // gentle push, eased
let ENDCARD_FADE = 0.5

struct Seg { let file: String; let start: Double; let dur: Double; let cap: String; let zoom: Int }
let segs = [
    Seg(file: "C3834", start: 36.0,  dur: 2.30, cap: "r01", zoom:  1),
    Seg(file: "C3816", start: 2.50,  dur: 1.80, cap: "r02", zoom: -1),
    Seg(file: "C3844", start: 15.0,  dur: 1.80, cap: "r03", zoom:  1),
    Seg(file: "C3818", start: 32.0,  dur: 1.75, cap: "r04", zoom: -1),
    Seg(file: "C3804", start: 20.0,  dur: 1.75, cap: "r05", zoom:  1),
    Seg(file: "C3842", start: 14.0,  dur: 1.70, cap: "r06", zoom: -1),
    Seg(file: "C3814", start: 141.0, dur: 1.80, cap: "r07", zoom:  1),
    Seg(file: "C3826", start: 38.0,  dur: 1.70, cap: "r08", zoom: -1),
    Seg(file: "C3812", start: 105.0, dur: 1.80, cap: "r09", zoom:  1),
    Seg(file: "C3806", start: 38.0,  dur: 1.70, cap: "r10", zoom: -1),
    Seg(file: "C3816", start: 7.50,  dur: 2.50, cap: "r11", zoom:  1),
    Seg(file: "C3834", start: 20.0,  dur: 3.90, cap: "",    zoom: -1),   // tail under the end card
]

let comp = AVMutableComposition()
guard let trackA = comp.addMutableTrack(withMediaType: .video, preferredTrackID: kCMPersistentTrackID_Invalid),
      let trackB = comp.addMutableTrack(withMediaType: .video, preferredTrackID: kCMPersistentTrackID_Invalid)
else { print("no tracks"); exit(1) }

let TS: Int32 = 600
func t(_ s: Double) -> CMTime { CMTime(seconds: s, preferredTimescale: TS) }
func tk(_ s: Double) -> Int64 { Int64((s * Double(TS)).rounded()) }
func ct(_ k: Int64) -> CMTime { CMTime(value: k, timescale: TS) }
func rangeK(_ a: Int64, _ b: Int64) -> CMTimeRange { CMTimeRange(start: ct(a), duration: ct(b - a)) }

func zoomAbout(_ z: CGFloat) -> CGAffineTransform {
    CGAffineTransform(translationX: -W/2, y: -H/2)
        .concatenating(CGAffineTransform(scaleX: z, y: z))
        .concatenating(CGAffineTransform(translationX: W/2, y: H/2))
}
// cubic ease-in-out
func ease(_ p: Double) -> Double {
    p < 0.5 ? 4*p*p*p : 1 - pow(-2*p + 2, 3)/2
}

struct Clip { let track: AVMutableCompositionTrack; let startK: Int64; let durK: Int64
              let base: CGAffineTransform; let z0: CGFloat; let z1: CGFloat }
var clips: [Clip] = []
let TK = tk(T)
var cursorK: Int64 = 0

for (i, s) in segs.enumerated() {
    let track = (i % 2 == 0) ? trackA : trackB
    let asset = AVURLAsset(url: URL(fileURLWithPath: "\(SRC)/\(s.file).MP4"))
    guard let src = asset.tracks(withMediaType: .video).first else { print("no track \(s.file)"); exit(1) }
    let durK = tk(s.dur)
    do { try track.insertTimeRange(CMTimeRange(start: t(s.start), duration: ct(durK)),
                                   of: src, at: ct(cursorK)) }
    catch { print("insert failed \(s.file): \(error)"); exit(1) }

    let tf = src.preferredTransform
    let rect = CGRect(origin: .zero, size: src.naturalSize).applying(tf)
    let dw = abs(rect.width), dh = abs(rect.height)
    let scale = max(W / dw, H / dh)
    let base = tf
        .concatenating(CGAffineTransform(translationX: -rect.minX, y: -rect.minY))
        .concatenating(CGAffineTransform(scaleX: scale, y: scale))
        .concatenating(CGAffineTransform(translationX: (W - dw*scale)/2, y: (H - dh*scale)/2))

    clips.append(Clip(track: track, startK: cursorK, durK: durK, base: base,
                      z0: s.zoom > 0 ? 1.0 : ZOOM, z1: s.zoom > 0 ? ZOOM : 1.0))
    cursorK += (i == segs.count - 1) ? durK : (durK - TK)
}
let totalK = cursorK
let total = Double(totalK) / Double(TS)
print(String(format: "timeline %.2fs, %d clips, %.2fs dissolves", total, clips.count, T))

// eased transform ramps for `clip` covering only [a,b] of the global timeline
func addRamps(_ li: AVMutableVideoCompositionLayerInstruction, _ c: Clip, _ aK: Int64, _ bK: Int64) {
    let span = bK - aK
    guard span > 0 else { return }
    let steps = Int64(max(1, min(14, span / 6)))
    func zAt(_ k: Int64) -> CGFloat {
        let p = ease(min(max(Double(k - c.startK) / Double(c.durK), 0), 1))
        return c.z0 + (c.z1 - c.z0) * CGFloat(p)
    }
    for i in 0..<steps {
        let ka = aK + span * i / steps
        let kb = (i == steps - 1) ? bK : aK + span * (i + 1) / steps
        guard kb > ka else { continue }
        li.setTransformRamp(fromStart: c.base.concatenating(zoomAbout(zAt(ka))),
                            toEnd:     c.base.concatenating(zoomAbout(zAt(kb))),
                            timeRange: rangeK(ka, kb))
    }
}

var instructions: [AVMutableVideoCompositionInstruction] = []
for (i, c) in clips.enumerated() {
    let soloA = (i == 0) ? Int64(0) : c.startK + TK
    let soloB = (i == clips.count - 1) ? c.startK + c.durK : clips[i+1].startK
    if soloB > soloA {
        let li = AVMutableVideoCompositionLayerInstruction(assetTrack: c.track)
        addRamps(li, c, soloA, soloB)
        let inst = AVMutableVideoCompositionInstruction()
        inst.timeRange = rangeK(soloA, soloB)
        inst.layerInstructions = [li]
        instructions.append(inst)
    }
    if i < clips.count - 1 {
        let n = clips[i+1]
        let a = n.startK, b = n.startK + TK
        let out = AVMutableVideoCompositionLayerInstruction(assetTrack: c.track)
        addRamps(out, c, a, b)
        out.setOpacityRamp(fromStartOpacity: 1.0, toEndOpacity: 0.0, timeRange: rangeK(a, b))
        let incoming = AVMutableVideoCompositionLayerInstruction(assetTrack: n.track)
        addRamps(incoming, n, a, b)
        let inst = AVMutableVideoCompositionInstruction()
        inst.timeRange = rangeK(a, b)
        inst.layerInstructions = [out, incoming]      // outgoing on top, fading away
        instructions.append(inst)
    }
}
// verify the instructions tile the timeline exactly
var walk: Int64 = 0
for inst in instructions {
    let s0 = inst.timeRange.start.value, d0 = inst.timeRange.duration.value
    if s0 != walk { print("GAP at \(walk) vs \(s0)"); exit(1) }
    walk = s0 + d0
}
if walk != totalK { print("timeline mismatch \(walk) vs \(totalK)"); exit(1) }
print("instructions tile cleanly: \(instructions.count)")

let vc = AVMutableVideoComposition()
vc.renderSize = CGSize(width: W, height: H)
vc.frameDuration = CMTime(value: 1, timescale: FPS)
vc.instructions = instructions

// ---------- overlays ----------
let videoLayer = CALayer(); videoLayer.frame = CGRect(x: 0, y: 0, width: W, height: H)
let parent = CALayer();     parent.frame     = CGRect(x: 0, y: 0, width: W, height: H)
parent.addSublayer(videoLayer)

func loadCG(_ p: String) -> CGImage? {
    guard let d = NSData(contentsOfFile: p), let s = CGImageSourceCreateWithData(d, nil) else { return nil }
    return CGImageSourceCreateImageAtIndex(s, 0, nil)
}
func overlayLayer(_ name: String) -> CALayer {
    guard let img = loadCG("ov4/\(name).png") else { print("missing ov4/\(name).png"); exit(1) }
    let l = CALayer()
    l.frame = CGRect(x: 0, y: 0, width: W, height: H)
    l.contents = img
    return l
}

// constant vignette for the whole reel
let vign = overlayLayer("vign")
vign.opacity = 1
parent.addSublayer(vign)

let easeInOut = CAMediaTimingFunction(name: .easeInEaseOut)

func fadeIn(_ l: CALayer, at inT: Double, out outT: Double, fade: Double) {
    l.opacity = 0
    let d = outT - inT
    let f = min(fade, d / 3)
    let a = CAKeyframeAnimation(keyPath: "opacity")
    a.values = [0, 1, 1, 0] as [NSNumber]
    a.keyTimes = [0, NSNumber(value: f/d), NSNumber(value: 1 - f/d), 1]
    a.timingFunctions = [easeInOut, easeInOut, easeInOut]
    a.beginTime = AVCoreAnimationBeginTimeAtZero + inT
    a.duration = d
    a.isRemovedOnCompletion = false
    a.fillMode = .both
    l.add(a, forKey: "op")
    parent.addSublayer(l)
}

for (i, s) in segs.enumerated() where !s.cap.isEmpty {
    let c = clips[i]
    let cStart = Double(c.startK) / Double(TS)
    let cDur   = Double(c.durK) / Double(TS)
    let inT  = (i == 0) ? 0.22 : cStart + 0.34
    let outT = cStart + cDur - 0.20
    fadeIn(overlayLayer(s.cap), at: inT, out: outT, fade: 0.30)
}

// end card rides the tail clip
let tail = clips[clips.count - 1]
let endLayer = overlayLayer("rend")
endLayer.opacity = 0
let ea = CAKeyframeAnimation(keyPath: "opacity")
ea.values = [0, 1, 1] as [NSNumber]
ea.keyTimes = [0, NSNumber(value: ENDCARD_FADE / (total - Double(tail.startK) / Double(TS))), 1]
ea.timingFunctions = [easeInOut, easeInOut]
let tailStart = Double(tail.startK) / Double(TS)
ea.beginTime = AVCoreAnimationBeginTimeAtZero + tailStart
ea.duration = total - tailStart
ea.isRemovedOnCompletion = false
ea.fillMode = .both
endLayer.add(ea, forKey: "op")
parent.addSublayer(endLayer)

vc.animationTool = AVVideoCompositionCoreAnimationTool(postProcessingAsVideoLayer: videoLayer, in: parent)

// ---------- export ----------
let outPath = CommandLine.arguments.count > 1 ? CommandLine.arguments[1] : "conf_reel_v2.mp4"
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
