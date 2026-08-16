import Foundation
import AVFoundation
for p in CommandLine.arguments.dropFirst() {
    let a = AVURLAsset(url: URL(fileURLWithPath: p))
    print("\n\(URL(fileURLWithPath: p).lastPathComponent)")
    guard let t = a.tracks(withMediaType: .video).first,
          let fds = t.formatDescriptions as? [CMFormatDescription], let fd = fds.first else { continue }
    let ext = CMFormatDescriptionGetExtensions(fd) as? [String: Any] ?? [:]
    for k in ["ColorPrimaries","TransferFunction","YCbCrMatrix","FullRangeVideo",
              "CVImageBufferColorPrimaries","CVImageBufferTransferFunction","CVImageBufferYCbCrMatrix"] {
        if let v = ext[k] { print("  \(k): \(v)") }
    }
    let codec = CMFormatDescriptionGetMediaSubType(fd)
    let cs = String(bytes: [UInt8((codec >> 24) & 255), UInt8((codec >> 16) & 255),
                            UInt8((codec >> 8) & 255), UInt8(codec & 255)], encoding: .ascii) ?? "?"
    print("  codec: \(cs)")
}
