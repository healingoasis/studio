import Foundation
import AVFoundation
import CoreImage
import AppKit

// Grade for flat / log-profile footage:
//   measured source sits at p1≈75, p50≈123, p95≈152 — i.e. squeezed into ~30% of the range.
//   The tone curve re-expands that with a soft shoulder so the ceiling lights don't clip.

func graded(_ input: CIImage) -> CIImage {
    var img = input

    // 0. neutralise the source cast FIRST, so the steep curve doesn't amplify it
    //    (measured midtones ran R 127 / G 122 / B 117)
    let wb = CIFilter(name: "CIColorMatrix")!
    wb.setValue(img, forKey: kCIInputImageKey)
    wb.setValue(CIVector(x: 0.958, y: 0, z: 0, w: 0), forKey: "inputRVector")
    wb.setValue(CIVector(x: 0, y: 1.000, z: 0, w: 0), forKey: "inputGVector")
    wb.setValue(CIVector(x: 0, y: 0, z: 1.052, w: 0), forKey: "inputBVector")
    img = wb.outputImage ?? img

    // 1. tone curve: set the black point, restore contrast, roll off highlights
    let curve = CIFilter(name: "CIToneCurve")!
    curve.setValue(img, forKey: kCIInputImageKey)
    curve.setValue(CIVector(x: 0.00, y: 0.015), forKey: "inputPoint0")
    curve.setValue(CIVector(x: 0.30, y: 0.075), forKey: "inputPoint1")
    curve.setValue(CIVector(x: 0.45, y: 0.360), forKey: "inputPoint2")
    curve.setValue(CIVector(x: 0.60, y: 0.730), forKey: "inputPoint3")
    curve.setValue(CIVector(x: 1.00, y: 0.945), forKey: "inputPoint4")
    img = curve.outputImage ?? img

    // 2. a whisper of warmth — the midtones already lean warm, so barely any
    let temp = CIFilter(name: "CITemperatureAndTint")!
    temp.setValue(img, forKey: kCIInputImageKey)
    temp.setValue(CIVector(x: 6500, y: 0), forKey: "inputNeutral")
    temp.setValue(CIVector(x: 6560, y: 0), forKey: "inputTargetNeutral")
    img = temp.outputImage ?? img

    // 3. vibrance first (protects the skin tones), then a modest global saturation lift
    let vib = CIFilter(name: "CIVibrance")!
    vib.setValue(img, forKey: kCIInputImageKey)
    vib.setValue(0.26, forKey: "inputAmount")
    img = vib.outputImage ?? img

    let cc = CIFilter(name: "CIColorControls")!
    cc.setValue(img, forKey: kCIInputImageKey)
    cc.setValue(1.05, forKey: kCIInputSaturationKey)
    cc.setValue(0.00, forKey: kCIInputBrightnessKey)
    cc.setValue(1.00, forKey: kCIInputContrastKey)
    img = cc.outputImage ?? img

    // 4. log footage is soft; a light unsharp pass, not a crunchy one
    let sharp = CIFilter(name: "CIUnsharpMask")!
    sharp.setValue(img, forKey: kCIInputImageKey)
    sharp.setValue(1.1, forKey: kCIInputRadiusKey)
    sharp.setValue(0.32, forKey: kCIInputIntensityKey)
    img = sharp.outputImage ?? img

    return img.cropped(to: input.extent)
}

let args = CommandLine.arguments
guard args.count >= 4 else { print("usage: grade still|video <in> <out>"); exit(1) }
let mode = args[1], inPath = args[2], outPath = args[3]
let ctx = CIContext(options: [.useSoftwareRenderer: false])

if mode == "still" {
    guard let img = CIImage(contentsOf: URL(fileURLWithPath: inPath)) else { print("bad input"); exit(1) }
    let out = graded(img)
    guard let cg = ctx.createCGImage(out, from: out.extent) else { print("render failed"); exit(1) }
    let rep = NSBitmapImageRep(cgImage: cg)
    try! rep.representation(using: .jpeg, properties: [.compressionFactor: 0.92])!
        .write(to: URL(fileURLWithPath: outPath))
    print("wrote \(outPath)")
    exit(0)
}

// ---- video ----
let asset = AVURLAsset(url: URL(fileURLWithPath: inPath))
let vcomp = AVVideoComposition(asset: asset) { request in
    request.finish(with: graded(request.sourceImage), context: nil)
}
try? FileManager.default.removeItem(atPath: outPath)
guard let ex = AVAssetExportSession(asset: asset, presetName: AVAssetExportPresetHighestQuality) else {
    print("no export session"); exit(1)
}
ex.outputURL = URL(fileURLWithPath: outPath)
ex.outputFileType = .mp4
ex.videoComposition = vcomp
ex.shouldOptimizeForNetworkUse = false

print(String(format: "grading %.1fs at %.0f fps...",
             CMTimeGetSeconds(asset.duration),
             asset.tracks(withMediaType: .video).first?.nominalFrameRate ?? 0))
let sem = DispatchSemaphore(value: 0)
var lastReport = -1
let timer = DispatchSource.makeTimerSource(queue: .global())
timer.schedule(deadline: .now() + 5, repeating: 5)
timer.setEventHandler {
    let p = Int(ex.progress * 100)
    if p != lastReport { print("  \(p)%"); lastReport = p }
}
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
