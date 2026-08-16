import Foundation
import AppKit

// usage: analyze <image.jpg> ...
for path in CommandLine.arguments.dropFirst() {
    guard let d = NSData(contentsOfFile: path),
          let src = CGImageSourceCreateWithData(d, nil),
          let cg = CGImageSourceCreateImageAtIndex(src, 0, nil) else { continue }

    let w = cg.width, h = cg.height
    var buf = [UInt8](repeating: 0, count: w * h * 4)
    let cs = CGColorSpaceCreateDeviceRGB()
    guard let ctx = CGContext(data: &buf, width: w, height: h, bitsPerComponent: 8,
                              bytesPerRow: w * 4, space: cs,
                              bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue) else { continue }
    ctx.draw(cg, in: CGRect(x: 0, y: 0, width: w, height: h))

    var hist = [[Int]](repeating: [Int](repeating: 0, count: 256), count: 4) // r,g,b,luma
    for i in stride(from: 0, to: w * h * 4, by: 4) {
        let r = Int(buf[i]), g = Int(buf[i+1]), b = Int(buf[i+2])
        hist[0][r] += 1; hist[1][g] += 1; hist[2][b] += 1
        let l = Int((0.2126 * Double(r) + 0.7152 * Double(g) + 0.0722 * Double(b)).rounded())
        hist[3][min(255, l)] += 1
    }
    let total = w * h
    func pct(_ ch: Int, _ p: Double) -> Int {
        let target = Int(Double(total) * p)
        var run = 0
        for v in 0..<256 { run += hist[ch][v]; if run >= target { return v } }
        return 255
    }
    func lo(_ ch: Int) -> Int { for v in 0..<256 where hist[ch][v] > 0 { return v }; return 0 }
    func hi(_ ch: Int) -> Int { for v in stride(from: 255, through: 0, by: -1) where hist[ch][v] > 0 { return v }; return 255 }
    let names = ["R", "G", "B", "Y"]
    print("\n\(URL(fileURLWithPath: path).lastPathComponent)  \(w)x\(h)")
    for c in 0..<4 {
        print(String(format: "  %@  min %3d  p1 %3d   p50 %3d   p95 %3d   p99 %3d  max %3d",
                     names[c], lo(c), pct(c, 0.01), pct(c, 0.50), pct(c, 0.95), pct(c, 0.99), hi(c)))
    }
}
