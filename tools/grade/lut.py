#!/usr/bin/env python3
"""
Sony S-Log3 / S-Gamut3.Cine -> Rec.709 as a 3D LUT (.cube).

Ported from tools/color-grade/slog3.swift, which produced the grade Daniel
approved on C8181. The technical conversion uses Sony's published maths; the
creative pass on top is the second stage of the standard two-stage workflow.
"""
import math, sys, argparse

# Sony S-Log3 EOTF: 10-bit code value -> scene linear (0.18 = mid grey)
BREAK = 171.2102946929
def slog3_to_linear(code):
    if code >= BREAK:
        return pow(10.0, (code - 420.0) / 261.5) * 0.19 - 0.01
    return (code - 95.0) * 0.01125000 / (BREAK - 95.0)

# S-Gamut3.Cine -> Rec.709 (Sony published matrix)
M = [[ 1.6229, -0.5027, -0.1202],
     [-0.0824,  1.1656, -0.0832],
     [-0.0084, -0.1963,  1.2047]]

def tone_map(l, white):
    x = max(0.0, l)
    return x * (1.0 + x / (white * white)) / (1.0 + x)

def encode_gamma(x):
    return pow(min(max(x, 0.0), 1.0), 1.0 / 2.4)

def clamp01(v):
    return min(max(v, 0.0), 1.0)

class Look:
    def __init__(self, exposure=1.0, contrast=1.0, saturation=1.0, toe=0.0,
                 scurve=0.0, split=0.0, legal_range=True, white=9.0,
                 wb_r=1.0, wb_b=1.0, lift=0.0):
        self.exposure = exposure; self.contrast = contrast
        self.saturation = saturation; self.toe = toe
        self.scurve = scurve; self.split = split
        self.legal_range = legal_range; self.white = white
        # black lift: raises the floor so shadows keep detail instead of
        # crushing to zero. This is what reads as "filmic" rather than "harsh".
        self.lift = lift
        # per-clip white balance, applied in LINEAR light where it belongs
        self.wb_r = wb_r; self.wb_b = wb_b

def grade_rgb(inRGB, k):
    """One RGB triple (0..1 encoded S-Log3) through the whole chain."""
    code = [(64.0 + v * 876.0) if k.legal_range else (v * 1023.0) for v in inRGB]
    lin = [slog3_to_linear(c) * k.exposure for c in code]
    # white balance in linear light, before the primaries matrix
    lin[0] *= k.wb_r
    lin[2] *= k.wb_b
    lin = [M[r][0]*lin[0] + M[r][1]*lin[1] + M[r][2]*lin[2] for r in range(3)]
    out = [encode_gamma(tone_map(v, k.white)) for v in lin]

    if k.toe > 0:   # subtract most at the bottom, almost nothing by mid grey
        out = [clamp01(v - k.toe * (1.0 - v)**3) for v in out]
    if k.lift > 0:
        out = [clamp01(k.lift + (1.0 - k.lift) * v) for v in out]
    if k.contrast != 1.0:   # around 0.435, mid grey in Rec.709
        out = [clamp01(0.435 + (v - 0.435) * k.contrast) for v in out]
    if k.scurve > 0:        # filmic S: firms the mids, leaves the ends alone
        out = [clamp01(v + k.scurve * ((v*v*(3-2*v)) - v)) for v in out]
    if k.split > 0:         # cool shadows / warm highlights = manufactured colour contrast
        y = 0.2126*out[0] + 0.7152*out[1] + 0.0722*out[2]
        sw = (1-y)*(1-y); hw = y*y
        out[0] += k.split * (-0.014*sw + 0.020*hw)
        out[1] += k.split * (-0.004*sw + 0.006*hw)
        out[2] += k.split * ( 0.030*sw - 0.018*hw)
        out = [clamp01(v) for v in out]
    if k.saturation != 1.0: # tapered in the highlights so blown areas stay clean white
        y = 0.2126*out[0] + 0.7152*out[1] + 0.0722*out[2]
        taper = 1.0 - 0.60 * max(0.0, (y - 0.72) / 0.28)
        sat = 1.0 + (k.saturation - 1.0) * taper
        out = [clamp01(y + (v - y) * sat) for v in out]
    return out

def write_cube(path, look, N=33, title="slog3-rec709"):
    lines = [f'TITLE "{title}"', f"LUT_3D_SIZE {N}", "DOMAIN_MIN 0.0 0.0 0.0",
             "DOMAIN_MAX 1.0 1.0 1.0", ""]
    d = N - 1
    # .cube order: red fastest, then green, then blue
    for b in range(N):
        for g in range(N):
            for r in range(N):
                o = grade_rgb([r/d, g/d, b/d], look)
                lines.append(f"{o[0]:.6f} {o[1]:.6f} {o[2]:.6f}")
    with open(path, "w") as f:
        f.write("\n".join(lines) + "\n")

def report(look):
    """Where the reference tones land. Checkable, not trusted."""
    rowsum = M[1][0] + M[1][1] + M[1][2]
    def through(code):
        v = encode_gamma(tone_map(slog3_to_linear(code) * look.exposure * rowsum, look.white))
        if look.toe > 0: v = clamp01(v - look.toe * (1.0 - v)**3)
        if look.lift > 0: v = clamp01(look.lift + (1.0 - look.lift) * v)
        if look.contrast != 1.0: v = clamp01(0.435 + (v - 0.435) * look.contrast)
        return round(v * 255)
    return (f"  reference: S-Log3 black(95) -> {through(95)}, "
            f"18% grey(420) -> {through(420)}, 90% white(598) -> {through(598)}")

if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("out")
    p.add_argument("--size", type=int, default=33)
    p.add_argument("--full", action="store_true")
    p.add_argument("--exp", type=float, default=1.0)
    p.add_argument("--con", type=float, default=1.0)
    p.add_argument("--sat", type=float, default=1.0)
    p.add_argument("--toe", type=float, default=0.0)
    p.add_argument("--scurve", type=float, default=0.0)
    p.add_argument("--split", type=float, default=0.0)
    p.add_argument("--white", type=float, default=9.0)
    p.add_argument("--wbr", type=float, default=1.0)
    p.add_argument("--wbb", type=float, default=1.0)
    p.add_argument("--lift", type=float, default=0.0)
    a = p.parse_args()
    look = Look(exposure=a.exp, contrast=a.con, saturation=a.sat, toe=a.toe,
                scurve=a.scurve, split=a.split, legal_range=not a.full,
                white=a.white, wb_r=a.wbr, wb_b=a.wbb, lift=a.lift)
    write_cube(a.out, look, N=a.size)
    print(f"S-Log3 -> Rec.709  range: {'full(0-1023)' if a.full else 'legal(64-940)'}  "
          f"exp {a.exp:.2f} con {a.con:.2f} sat {a.sat:.2f} toe {a.toe:.2f} "
          f"scurve {a.scurve:.2f} split {a.split:.2f}")
    print(report(look))
    print(f"  wrote {a.out}  ({a.size}^3)")
