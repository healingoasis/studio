#!/usr/bin/env python3
"""
The same look as the video, built for RAW stills.

sips develops a Sony .ARW to LINEAR 16-bit -- no tone curve. That is the same
place the video grade begins (S-Log3 is decoded to linear before anything else),
so both paths can share one creative pass and genuinely match, rather than being
tuned separately by eye until they look close.

The LUT takes gamma-encoded input rather than linear: a 3D LUT has fixed spacing,
and linear data bunches almost everything into the bottom of the range where the
grid is too coarse to resolve it.
"""
import argparse
from lut import tone_map, encode_gamma, clamp01

PRE_GAMMA = 2.2   # input is linear^(1/2.2); undo it before working

def grade_photo(v, k):
    lin = [clamp01(c) ** PRE_GAMMA * k["exposure"] for c in v]
    lin[0] *= k["wb_r"]; lin[2] *= k["wb_b"]
    out = [encode_gamma(tone_map(x, k["white"])) for x in lin]
    if k["toe"] > 0:
        out = [clamp01(x - k["toe"] * (1.0 - x) ** 3) for x in out]
    if k["lift"] > 0:
        out = [clamp01(k["lift"] + (1.0 - k["lift"]) * x) for x in out]
    if k["contrast"] != 1.0:
        out = [clamp01(0.435 + (x - 0.435) * k["contrast"]) for x in out]
    if k["scurve"] > 0:
        out = [clamp01(x + k["scurve"] * ((x*x*(3-2*x)) - x)) for x in out]
    if k["split"] > 0:
        y = 0.2126*out[0] + 0.7152*out[1] + 0.0722*out[2]
        sw = (1-y)*(1-y); hw = y*y
        out[0] += k["split"] * (-0.014*sw + 0.020*hw)
        out[1] += k["split"] * (-0.004*sw + 0.006*hw)
        out[2] += k["split"] * ( 0.030*sw - 0.018*hw)
        out = [clamp01(x) for x in out]
    if k["saturation"] != 1.0:
        y = 0.2126*out[0] + 0.7152*out[1] + 0.0722*out[2]
        taper = 1.0 - 0.60 * max(0.0, (y - 0.72) / 0.28)
        sat = 1.0 + (k["saturation"] - 1.0) * taper
        out = [clamp01(y + (x - y) * sat) for x in out]
    return out

def default_look(exposure=1.0, wb_r=1.0, wb_b=1.0):
    return {"exposure": exposure, "wb_r": wb_r, "wb_b": wb_b, "white": 9.0,
            "toe": 0.38, "lift": 0.05, "contrast": 1.12, "scurve": 0.30,
            "split": 1.05, "saturation": 1.28}

def write_photo_cube(path, k, N=33):
    lines = [f'TITLE "photo"', f"LUT_3D_SIZE {N}",
             "DOMAIN_MIN 0.0 0.0 0.0", "DOMAIN_MAX 1.0 1.0 1.0", ""]
    d = N - 1
    for b in range(N):
        for g in range(N):
            for r in range(N):
                o = grade_photo([r/d, g/d, b/d], k)
                lines.append(f"{o[0]:.6f} {o[1]:.6f} {o[2]:.6f}")
    open(path, "w").write("\n".join(lines) + "\n")

if __name__ == "__main__":
    a = argparse.ArgumentParser(); a.add_argument("out")
    a.add_argument("--exp", type=float, default=1.0)
    a.add_argument("--size", type=int, default=33)
    n = a.parse_args()
    write_photo_cube(n.out, default_look(exposure=n.exp), N=n.size)
    print(f"wrote {n.out}")
