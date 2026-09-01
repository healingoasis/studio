"""Photographic grading for the rescue's own photographs.
Exposure, contrast, shadow recovery, colour and sharpening only — nothing added
to the scene, nothing taken out of it."""
from PIL import Image, ImageEnhance, ImageFilter
import math

def luma_percentiles(im, lo=0.004, hi=0.996):
    h = im.convert("L").histogram()
    n = sum(h); c = 0; p_lo = 0; p_hi = 255
    for v, k in enumerate(h):
        c += k
        if p_lo == 0 and c >= n*lo: p_lo = v
        if c >= n*hi: p_hi = v; break
    return max(p_lo, 0), min(max(p_hi, p_lo+1), 255)

def build_lut(p_lo, p_hi, black=4, white=247, s=0.36, shadow=0.14, knee=0.80, gamma=1.0):
    lut = []
    for v in range(256):
        x = (v - p_lo) / float(p_hi - p_lo)          # levels
        x = min(1.0, max(0.0, x))
        x = x + s * x * (1 - x) * (2 * x - 1)        # S-curve contrast
        if shadow:                                    # recover the deep end
            x += shadow * math.exp(-((x / 0.22) ** 2)) * (1 - x) * 0.9
        if x > knee:                                  # roll the highlights off
            x = knee + (x - knee) * 0.55
        if gamma != 1.0:
            x = x ** (1.0 / gamma)
        x = min(1.0, max(0.0, x))
        lut.append(int(round(black + x * (white - black))))
    return lut

def warm(im, r=1.016, g=1.004, b=0.989):
    R, G, B = im.split()
    R = R.point(lambda v: min(255, int(v*r)))
    G = G.point(lambda v: min(255, int(v*g)))
    B = B.point(lambda v: min(255, int(v*b)))
    return Image.merge("RGB", (R, G, B))

def vignette(im, amount=0.16):
    w, h = im.size
    m = Image.new("L", (w, h), 255)
    px = m.load()
    cx, cy = w/2.0, h/2.0
    rmax = math.hypot(cx, cy)
    for y in range(0, h, 2):
        for x in range(0, w, 2):
            d = math.hypot(x-cx, y-cy)/rmax
            v = int(255 * (1 - amount * max(0.0, d-0.45)/0.55))
            for dy in (0,1):
                for dx in (0,1):
                    if x+dx < w and y+dy < h: px[x+dx, y+dy] = v
    dark = Image.new("RGB", (w, h), (0, 0, 0))
    return Image.composite(im, dark, m)

def grade(im, sat=1.14, s=0.36, shadow=0.14, sharp=(1.4, 95, 3), vig=0.08):
    p_lo, p_hi = luma_percentiles(im)
    lut = build_lut(p_lo, p_hi, s=s, shadow=shadow)
    out = im.point(lut * 3)
    out = warm(out)
    out = ImageEnhance.Color(out).enhance(sat)
    if vig: out = vignette(out, vig)
    out = out.filter(ImageFilter.UnsharpMask(radius=sharp[0], percent=sharp[1], threshold=sharp[2]))
    return out
