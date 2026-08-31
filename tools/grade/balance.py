#!/usr/bin/env python3
"""
Per-clip normalisation: solve exposure and shadow toe so every clip lands on the
same tonal targets before the look goes on.

This is the shot-matching step. Without it, a fixed toe crushes an already
contrasty backlit clip and goes flat on a bright arena one -- which is exactly
how a batch job announces itself as a batch job.
"""
import os, tempfile, subprocess
from PIL import Image
from lut import Look, grade_rgb, slog3_to_linear
from analyze import probe, sample_frames, FF

# Targets from the earlier notes, measured on the approved grade.
# A scene is not supposed to average mid-grey. Forcing every clip to 125 pushed
# dim barns 4-6x brighter than they were shot, washing out the highlights.
# 105 with a tight clamp keeps this a correction, not a normaliser.
T_MID = 105/255.0
EXP_MIN, EXP_MAX = 0.70, 2.20
# The black floor is a LOOK choice, not a per-clip correction, so it is fixed.
# Solving it per clip to hit a shadow target made contrasty scenes go milky --
# the p1 target in the old notes came off a flat-lit arena and does not travel.
LIFT = 0.05
LUMA = (0.2126, 0.7152, 0.0722)

def collect(clip, frames=6, per_frame=1200):
    dur, full, tenbit, w, h, fps = probe(clip)
    px = []
    with tempfile.TemporaryDirectory() as d:
        for fp in sample_frames(clip, frames, dur, d):
            im = Image.open(fp).convert("RGB")
            data = list(im.getdata())
            step = max(1, len(data)//per_frame)
            px += [tuple(v/255.0 for v in p) for p in data[::step]]
    return px, dur, full, tenbit, w, h, fps

def percentiles(px, look, qs=(0.01, 0.50)):
    ys = []
    for p in px:
        o = grade_rgb(list(p), look)
        ys.append(LUMA[0]*o[0] + LUMA[1]*o[1] + LUMA[2]*o[2])
    ys.sort()
    n = len(ys)
    return [ys[min(n-1, int(n*q))] for q in qs]

def solve(clip, wb_r=1.0, wb_b=1.0, look_kw=None, frames=6):
    """Bisect exposure to put the midtone on target, then toe for the shadows."""
    look_kw = look_kw or {}
    px, dur, full, tenbit, w, h, fps = collect(clip, frames=frames)
    if not px: return None
    def mk(exp, lift, toe=0.38):
        return Look(exposure=exp, toe=toe, lift=lift, legal_range=not full,
                    wb_r=wb_r, wb_b=wb_b,
                    contrast=look_kw.get("con",1.12),
                    saturation=look_kw.get("sat",1.28),
                    scurve=look_kw.get("scurve",0.30),
                    split=look_kw.get("split",1.05))
    # Only exposure is solved. Colour balance and exposure are corrections and
    # vary per clip; the look sits on top of them unchanged, which is what makes
    # 99 clips read as one piece of film.
    lift = LIFT
    lo, hi = EXP_MIN, EXP_MAX
    for _ in range(18):
        mid = (lo+hi)/2
        if percentiles(px, mk(mid, lift), qs=(0.50,))[0] < T_MID: lo = mid
        else: hi = mid
    exposure = round(min(EXP_MAX, max(EXP_MIN, (lo+hi)/2)), 4)
    final = mk(exposure, lift)
    p1, p50 = percentiles(px, final, qs=(0.01, 0.50))
    return {"exposure": exposure, "lift": lift, "toe": 0.38, "full_range": full,
            "ten_bit": tenbit, "duration": round(dur,2),
            "w": w, "h": h, "fps": fps,
            "p1": round(p1*255), "p50": round(p50*255)}

if __name__ == "__main__":
    import sys, json
    from analyze import measure
    for c in sys.argv[1:]:
        m = measure(c, frames=4)
        r = solve(c, wb_r=m["wb_r"], wb_b=m["wb_b"])
        print(os.path.basename(c), json.dumps(r))
