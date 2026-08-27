// Survey video files: duration, dimensions, and a contact-sheet frame or three.
// There is no ffmpeg on this machine, so AVFoundation does the work.
//
//   swiftc -O -o survey survey.swift
//   ./survey list  <dir>                 -> tsv of file, seconds, w, h
//   ./survey grab  <file> <out.jpg> <t>  -> one frame at t seconds, 640 wide

import AVFoundation
import Foundation
import CoreImage
import AppKit

let ctx = CIContext()

func info(_ url: URL) -> (Double, Int, Int)? {
    let asset = AVURLAsset(url: url)
    guard let track = asset.tracks(withMediaType: .video).first else { return nil }
    let d = CMTimeGetSeconds(asset.duration)
    let sz = track.naturalSize.applying(track.preferredTransform)
    return (d, Int(abs(sz.width)), Int(abs(sz.height)))
}

func grab(_ url: URL, at t: Double, to out: URL, width: CGFloat) -> Bool {
    let asset = AVURLAsset(url: url)
    let gen = AVAssetImageGenerator(asset: asset)
    gen.appliesPreferredTrackTransform = true
    gen.requestedTimeToleranceBefore = CMTime(seconds: 0.6, preferredTimescale: 600)
    gen.requestedTimeToleranceAfter = CMTime(seconds: 0.6, preferredTimescale: 600)
    guard let cg = try? gen.copyCGImage(at: CMTime(seconds: t, preferredTimescale: 600), actualTime: nil)
    else { return false }
    var img = CIImage(cgImage: cg)
    let scale = width / img.extent.width
    img = img.transformed(by: CGAffineTransform(scaleX: scale, y: scale))
    guard let outCG = ctx.createCGImage(img, from: img.extent) else { return false }
    let rep = NSBitmapImageRep(cgImage: outCG)
    guard let data = rep.representation(using: .jpeg, properties: [.compressionFactor: 0.7]) else { return false }
    try? data.write(to: out)
    return true
}

let args = CommandLine.arguments
guard args.count >= 3 else { print("usage: survey list <dir> | survey grab <file> <out> <t>"); exit(1) }

switch args[1] {
case "list":
    let dir = URL(fileURLWithPath: args[2])
    let files = (try? FileManager.default.contentsOfDirectory(at: dir, includingPropertiesForKeys: nil)) ?? []
    for f in files.sorted(by: { $0.lastPathComponent < $1.lastPathComponent }) {
        let ext = f.pathExtension.lowercased()
        guard ["mov", "mp4", "m4v", "avi"].contains(ext) else { continue }
        if let (d, w, h) = info(f) {
            print("\(f.lastPathComponent)\t\(String(format: "%.1f", d))\t\(w)\t\(h)")
        }
    }
case "grab":
    let ok = grab(URL(fileURLWithPath: args[2]), at: Double(args[4]) ?? 1.0,
                  to: URL(fileURLWithPath: args[3]), width: 640)
    if !ok { FileHandle.standardError.write("failed: \(args[2])\n".data(using: .utf8)!) ; exit(2) }
default:
    print("unknown command"); exit(1)
}
