import Foundation
import AVFoundation
import CoreImage
import AppKit

// ---------------------------------------------------------------------------
// Sony S-Log3 / S-Gamut3.Cine  ->  Rec.709
//
// Built as a 3D LUT from the published transfer function rather than an
// eyeballed curve, so mid grey and 90% white land exactly where they should.
// ---------------------------------------------------------------------------

// Sony S-Log3 EOTF: 10-bit code value -> scene linear (0.18 = mid grey)
func slog3ToLinear(_ code: Double) -> Double {
    if code >= 171.2102946929 {
        return pow(10.0, (code - 420.0) / 261.5) * 0.19 - 0.01
    }
    return (code - 95.0) * 0.01125000 / (171.2102946929 - 95.0)
}

// S-Gamut3.Cine -> Rec.709 (Sony published matrix)
let M: [[Double]] = [
    [ 1.6229, -0.5027, -0.1202],
    [-0.0824,  1.1656, -0.0832],
    [-0.0084, -0.1963,  1.2047],
]

// Reinhard shoulder with a white point: 600% reflectance rolls off to 1.0,
// which keeps the ceiling lights and the doorway from smearing into flat white.
var WHITE = 9.0
func toneMap(_ l: Double) -> Double {
    let x = max(0.0, l)
    return x * (1.0 + x / (WHITE * WHITE)) / (1.0 + x)
}

func encodeGamma(_ x: Double) -> Double { pow(min(max(x, 0.0), 1.0), 1.0 / 2.4) }

struct Look {
    var exposure: Double = 1.0     // linear multiplier before tone mapping
    var contrast: Double = 1.0     // pivot contrast applied after gamma
    var saturation: Double = 1.0
    var toe: Double = 0.0          // shadow toe: deepens blacks, leaves mids/highs alone
    var legalRange: Bool = true    // decoded 0..1 came from 64-940 legal range
}

func buildCube(_ look: Look, size N: Int = 64) -> Data {
    var data = [Float](repeating: 0, count: N * N * N * 4)
    var i = 0
    for b in 0..<N {
        for g in 0..<N {
            for r in 0..<N {
                let inRGB = [Double(r), Double(g), Double(b)].map { $0 / Double(N - 1) }
                // 0..1 -> 10-bit code value
                let code = inRGB.map { look.legalRange ? 64.0 + $0 * 876.0 : $0 * 1023.0 }
                var lin = code.map { slog3ToLinear($0) * look.exposure }
                // S-Gamut3.Cine -> Rec.709 primaries
                lin = (0..<3).map { row in
                    M[row][0] * lin[0] + M[row][1] * lin[1] + M[row][2] * lin[2]
                }
                var out = lin.map { encodeGamma(toneMap($0)) }
                // shadow toe: subtract most at the bottom, almost nothing by mid grey
                if look.toe > 0 {
                    out = out.map { v in
                        let k = (1.0 - v) * (1.0 - v) * (1.0 - v)
                        return min(max(v - look.toe * k, 0), 1)
                    }
                }
                // contrast around 0.435 (mid grey in Rec.709)
                if look.contrast != 1.0 {
                    out = out.map { min(max(0.435 + ($0 - 0.435) * look.contrast, 0), 1) }
                }
                if look.saturation != 1.0 {
                    let y = 0.2126*out[0] + 0.7152*out[1] + 0.0722*out[2]
                    out = out.map { min(max(y + ($0 - y) * look.saturation, 0), 1) }
                }
                data[i+0] = Float(out[0]); data[i+1] = Float(out[1])
                data[i+2] = Float(out[2]); data[i+3] = 1.0
                i += 4
            }
        }
    }
    return data.withUnsafeBufferPointer { Data(buffer: $0) }
}

// print where the reference tones land, so the maths can be checked not guessed
func reportReferences(_ look: Look) {
    func through(_ codeValue: Double) -> Int {
        let lin = slog3ToLinear(codeValue) * look.exposure
        // neutral grey: the matrix rows sum to ~1 so a neutral stays neutral
        let sum = M[1][0] + M[1][1] + M[1][2]
        var v = encodeGamma(toneMap(lin * sum))
        if look.toe > 0 { let k = pow(1.0 - v, 3); v = min(max(v - look.toe * k, 0), 1) }
        if look.contrast != 1.0 { v = min(max(0.435 + (v - 0.435) * look.contrast, 0), 1) }
        return Int((v * 255).rounded())
    }
    print(String(format: "  reference: S-Log3 black(95) -> %d,  18%% grey(420) -> %d,  90%% white(598) -> %d",
                 through(95), through(420), through(598)))
}

// ---------------------------------------------------------------------------
let args = CommandLine.arguments
guard args.count >= 4 else { print("usage: slog3 still|video <in> <out> [--full] [--exp N] [--con N] [--sat N]"); exit(1) }
let mode = args[1], inPath = args[2], outPath = args[3]

var look = Look()
var idx = 4
while idx < args.count {
    switch args[idx] {
    case "--full": look.legalRange = false; idx += 1
    case "--exp":  look.exposure   = Double(args[idx+1]) ?? 1.0; idx += 2
    case "--con":  look.contrast   = Double(args[idx+1]) ?? 1.0; idx += 2
    case "--sat":  look.saturation = Double(args[idx+1]) ?? 1.0; idx += 2
    case "--white": WHITE = Double(args[idx+1]) ?? 9.0; idx += 2
    case "--toe":  look.toe = Double(args[idx+1]) ?? 0.0; idx += 2
    default: idx += 1
    }
}
print("S-Log3 -> Rec.709   range: \(look.legalRange ? "legal(64-940)" : "full(0-1023)")  " +
      String(format: "exp %.2f  con %.2f  sat %.2f", look.exposure, look.contrast, look.saturation))
reportReferences(look)

let cubeData = buildCube(look)
func applyLUT(_ img: CIImage) -> CIImage {
    let f = CIFilter(name: "CIColorCube")!
    f.setValue(img, forKey: kCIInputImageKey)
    f.setValue(64, forKey: "inputCubeDimension")
    f.setValue(cubeData, forKey: "inputCubeData")
    return (f.outputImage ?? img).cropped(to: img.extent)
}

// unmanaged context: the LUT expects the encoded signal, not a colour-converted one
let ctx = CIContext(options: [.workingColorSpace: NSNull(), .outputColorSpace: NSNull()])

if mode == "still" {
    guard let img = CIImage(contentsOf: URL(fileURLWithPath: inPath),
                            options: [.colorSpace: NSNull()]) else { print("bad input"); exit(1) }
    let out = applyLUT(img)
    guard let cg = ctx.createCGImage(out, from: out.extent,
                                     format: .RGBA8,
                                     colorSpace: CGColorSpace(name: CGColorSpace.sRGB)!) else {
        print("render failed"); exit(1)
    }
    try! NSBitmapImageRep(cgImage: cg)
        .representation(using: .jpeg, properties: [.compressionFactor: 0.92])!
        .write(to: URL(fileURLWithPath: outPath))
    print("wrote \(outPath)")
    exit(0)
}

let asset = AVURLAsset(url: URL(fileURLWithPath: inPath))
let vcomp = AVVideoComposition(asset: asset) { request in
    request.finish(with: applyLUT(request.sourceImage), context: ctx)
}
try? FileManager.default.removeItem(atPath: outPath)
guard let ex = AVAssetExportSession(asset: asset, presetName: AVAssetExportPresetHighestQuality) else {
    print("no export session"); exit(1)
}
ex.outputURL = URL(fileURLWithPath: outPath)
ex.outputFileType = .mp4
ex.videoComposition = vcomp

print(String(format: "grading %.1fs at %.0f fps...", CMTimeGetSeconds(asset.duration),
             asset.tracks(withMediaType: .video).first?.nominalFrameRate ?? 0))
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
