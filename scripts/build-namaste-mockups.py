"""Print the rescue's artwork onto real photographs of real garments.

The ink is modulated by the fabric's own luminance, so the print sinks into the
folds and shadows of the actual cloth instead of sitting on top like a sticker.
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops, ImageStat
import pathlib

SHOTS = pathlib.Path(__file__).parent / "shots"
GEO   = "/System/Library/Fonts/Supplemental/Georgia.ttf"
GEOB  = "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"
MONO  = "/System/Library/Fonts/Menlo.ttc"

def geo(sz, bold=False): return ImageFont.truetype(GEOB if bold else GEO, sz)
def mono(sz):            return ImageFont.truetype(MONO, sz, index=0)

def tracked(d, xy, text, font, fill, track=0, anchor="mm"):
    """PIL has no letter-spacing; lay the glyphs out by hand."""
    widths = [d.textlength(ch, font=font) for ch in text]
    total  = sum(widths) + track * max(len(text) - 1, 0)
    x, y = xy
    if anchor.startswith("m"): x -= total / 2
    elif anchor.startswith("r"): x -= total
    for ch, w in zip(text, widths):
        d.text((x, y), ch, font=font, fill=fill, anchor="l" + anchor[1])
        x += w + track
    return total

# ── the two artworks, drawn at print resolution ──────────────────────────────
def art_intake(W, H, ink=None):
    """The intake-record form: the header every seized horse arrives on."""
    im = Image.new("L", (W, H), 0); d = ImageDraw.Draw(im)
    pad = int(W * 0.02)
    d.rectangle([pad, pad, W - pad, H - pad], outline=255, width=max(3, W // 150))
    p2 = pad + int(W * 0.028)
    d.rectangle([p2, p2, W - p2, H - p2], outline=140, width=max(1, W // 460))
    cx = W // 2
    tracked(d, (cx, int(H * .115)), "NAMASTE EQUINE RESCUE", mono(int(H * .046)), 235, track=int(W * .017))
    d.line([(W * .13, H * .175), (W * .87, H * .175)], fill=120, width=max(1, W // 460))
    d.text((cx, int(H * .315)), "INTAKE", font=geo(int(H * .20)), fill=255, anchor="mm")
    d.text((cx, int(H * .495)), "RECORD", font=geo(int(H * .20)), fill=255, anchor="mm")
    d.line([(W * .13, H * .60), (W * .87, H * .60)], fill=120, width=max(1, W // 460))
    rows = [("SEIZED BY", "LAW ENFORCEMENT"), ("STATE", "WISCONSIN"), ("OUTCOME", "RE-HOMED")]
    f = mono(int(H * .040)); y = H * .672
    for k, v in rows:
        tracked(d, (W * .135, y), k, f, 150, track=int(W * .006), anchor="lm")
        tracked(d, (W * .865, y), v, f, 235, track=int(W * .006), anchor="rm")
        y += H * .072
    tracked(d, (cx, int(H * .925)), "EST. 2014 · UNION GROVE, WI", mono(int(H * .034)), 140, track=int(W * .011))
    return im

def art_250(W, H, ink=None):
    """Red's actual weight gain, set the size it deserves."""
    im = Image.new("L", (W, H), 0); d = ImageDraw.Draw(im)
    cx = W // 2
    tracked(d, (cx, int(H * .07)), "WHAT RECOVERY WEIGHS", mono(int(H * .038)), 170, track=int(W * .012))
    d.text((cx, int(H * .375)), "+250", font=geo(int(H * .40)), fill=255, anchor="mm")
    tracked(d, (cx, int(H * .655)), "POUNDS", mono(int(H * .055)), 235, track=int(W * .040))
    d.line([(W * .27, H * .745), (W * .73, H * .745)], fill=125, width=max(2, W // 400))
    tracked(d, (cx, int(H * .825)), "RED · 7YO QUARTER HORSE", mono(int(H * .034)), 200, track=int(W * .009))
    tracked(d, (cx, int(H * .895)), "PLEASANT PRAIRIE · 2015", mono(int(H * .034)), 200, track=int(W * .009))
    return im

# ── put ink on cloth ─────────────────────────────────────────────────────────
def print_on(garment, art_L, box, ink=(238, 234, 244), strength=.92, soften=1.1):
    """box = (left, top, right, bottom) in fractions of the garment image."""
    g = garment.convert("RGB")
    W, H = g.size
    l, t, r, b = [int(v * s) for v, s in zip(box, (W, H, W, H))]
    pw, ph = r - l, b - t

    region = g.crop((l, t, r, b))
    gray = region.convert("L")
    mean = ImageStat.Stat(gray).mean[0] / 255.0

    # the cloth's own folds and shadows modulate how the ink reads
    def shade(v):
        s = 0.74 + 2.6 * ((v / 255.0) - mean)
        return int(max(0.0, min(1.0, s)) * 255)
    shade_map = gray.point(shade).filter(ImageFilter.GaussianBlur(1.4)).convert("RGB")

    inked = ImageChops.multiply(Image.new("RGB", (pw, ph), ink), shade_map)

    mask = art_L.resize((pw, ph), Image.LANCZOS).filter(ImageFilter.GaussianBlur(soften))
    mask = mask.point(lambda v: int(v * strength))

    g.paste(Image.composite(inked, region, mask), (l, t))
    return g

def studio(im, size=1200, margin=.06, vignette=.10):
    """Square product framing. The pad is a blurred cover of the shot itself,
    so there is never a visible seam where the photograph ends."""
    cover = im.copy()
    s = max(size / cover.width, size / cover.height)
    cover = cover.resize((int(cover.width * s) + 2, int(cover.height * s) + 2), Image.LANCZOS)
    cx, cy = cover.width // 2, cover.height // 2
    canvas = cover.crop((cx - size//2, cy - size//2, cx - size//2 + size, cy - size//2 + size))
    canvas = canvas.filter(ImageFilter.GaussianBlur(size * .055))

    avail = int(size * (1 - 2 * margin))
    s2 = min(avail / im.width, avail / im.height)
    im2 = im.resize((max(1, int(im.width * s2)), max(1, int(im.height * s2))), Image.LANCZOS)
    canvas.paste(im2, ((size - im2.width) // 2, (size - im2.height) // 2))

    if vignette > 0:
        mask = Image.new("L", (size, size), 0)
        ImageDraw.Draw(mask).ellipse([-size*.28, -size*.28, size*1.28, size*1.28], fill=255)
        mask = mask.filter(ImageFilter.GaussianBlur(size * .10))
        dark = Image.new("RGB", (size, size), (196, 191, 205))
        canvas = Image.composite(canvas, Image.blend(canvas, dark, vignette), mask)
    return canvas


def fit(d, text, maxw, maker, start, track=0):
    """Shrink a face until the tracked string actually fits the space."""
    size = start
    while size > 7:
        f = maker(size)
        w = sum(d.textlength(c, font=f) for c in text) + track * max(len(text) - 1, 0)
        if w <= maxw:
            return f
        size -= 1
    return maker(7)


def art_sheet(W, H, logo_path="shots/logo.png"):
    """The sticker sheet, drawn as the flat printed piece it actually is."""
    im = Image.new("RGB", (W, H), (248, 247, 250))
    d = ImageDraw.Draw(im)
    cut = (205, 200, 216)
    INK, ORCHID, BONE, PALE = (22,19,27), (110,42,147), (231,226,218), (244,228,252)

    def kiss(b, r): d.rounded_rectangle([b[0]-11, b[1]-11, b[2]+11, b[3]+11],
                                        radius=r, outline=cut, width=max(2, W//620))
    def centre(b): return ((b[0]+b[2])//2, (b[1]+b[3])//2)

    # 1 — the rescue's own mark, on bone so their logo reads as drawn
    cxx, cyy, r = int(W*.155), int(H*.30), int(W*.105)
    d.ellipse([cxx-r-11, cyy-r-11, cxx+r+11, cyy+r+11], outline=cut, width=max(2, W//620))
    d.ellipse([cxx-r, cyy-r, cxx+r, cyy+r], fill=BONE)
    logo = Image.open(logo_path).convert("RGBA")
    s = (r*1.55) / logo.width
    logo = logo.resize((int(logo.width*s), int(logo.height*s)), Image.LANCZOS)
    im.paste(logo, (cxx-logo.width//2, cyy-logo.height//2), logo)

    # 2 — Red's number
    b = [int(W*.335), int(H*.115), int(W*.545), int(H*.485)]
    kiss(b, int(W*.024)); d.rounded_rectangle(b, radius=int(W*.018), fill=INK)
    cx, cy = centre(b); bw = b[2]-b[0]
    d.text((cx, cy-int(H*.035)), "+250", font=fit(d, "+250", bw*.72, geo, int(H*.15)),
           fill=(242,236,247), anchor="mm")
    f = fit(d, "POUNDS BACK", bw*.80, mono, int(H*.036), track=int(W*.006))
    tracked(d, (cx, cy+int(H*.085)), "POUNDS BACK", f, (199,123,230), track=int(W*.006))

    # 3 — the zero we are proud of
    b = [int(W*.585), int(H*.115), int(W*.775), int(H*.485)]
    kiss(b, int(W*.024)); d.rounded_rectangle(b, radius=int(W*.018), fill=ORCHID)
    cx, cy = centre(b); bw = b[2]-b[0]
    d.text((cx, cy-int(H*.045)), "0", font=fit(d, "0", bw*.42, geo, int(H*.20)), fill=(255,255,255), anchor="mm")
    f = fit(d, "WAITING FOR", bw*.82, mono, int(H*.032), track=int(W*.005))
    tracked(d, (cx, cy+int(H*.062)), "WAITING FOR", f, PALE, track=int(W*.005))
    tracked(d, (cx, cy+int(H*.112)), "A HOME", f, PALE, track=int(W*.005))

    # 4 — the line this place runs on
    b = [int(W*.055), int(H*.615), int(W*.545), int(H*.885)]
    kiss(b, int(W*.024)); d.rounded_rectangle(b, radius=int(W*.018), fill=INK)
    cx = (b[0]+b[2])//2; bw = b[2]-b[0]
    l1 = "When the law takes a horse away,"
    d.text((cx, int(H*.705)), l1, font=fit(d, l1, bw*.88, geo, int(H*.055)), fill=(242,236,247), anchor="mm")
    ital = lambda s: ImageFont.truetype("/System/Library/Fonts/Supplemental/Georgia Italic.ttf", s)
    l2 = "we take him next."
    d.text((cx, int(H*.795)), l2, font=fit(d, l2, bw*.62, ital, int(H*.058)), fill=(199,123,230), anchor="mm")

    # 5 — the plain stamp
    b = [int(W*.605), int(H*.615), int(W*.945), int(H*.885)]
    kiss(b, int(W*.024)); d.rounded_rectangle(b, radius=int(W*.018), fill=BONE)
    cx = (b[0]+b[2])//2; bw = b[2]-b[0]
    f = fit(d, "RESCUE · EST. 2014", bw*.82, mono, int(H*.045), track=int(W*.008))
    tracked(d, (cx, int(H*.712)), "NAMASTE EQUINE", f, INK, track=int(W*.008))
    tracked(d, (cx, int(H*.782)), "RESCUE · EST. 2014", f, INK, track=int(W*.008))
    return im


def isolate(im, thresh=186, feather=2, pad=14):
    """Keep only the garment that contains the centre column; whiten its neighbours.

    The three shirts in the source photo overlap, so no rectangular crop can
    separate them — this walks each row and keeps the single dark run the
    centre falls inside.
    """
    im = im.convert("RGB")
    W, H = im.size
    gray = im.convert("L").filter(ImageFilter.MedianFilter(3))
    gp = gray.load()
    mask = Image.new("L", (W, H), 0)
    mp = mask.load()
    cx = W // 2
    for y in range(H):
        row = [gp[x, y] < thresh for x in range(W)]
        if not row[cx]:
            # above the shoulders: keep a narrow band around the hanger hook
            near = [x for x in range(max(0, cx - 90), min(W, cx + 90)) if row[x]]
            if not near:
                continue
            a, b = min(near), max(near)
        else:
            a = cx
            while a > 0 and row[a - 1]: a -= 1
            b = cx
            while b < W - 1 and row[b + 1]: b += 1
        for x in range(max(0, a - pad), min(W, b + pad + 1)):
            mp[x, y] = 255
    mask = mask.filter(ImageFilter.GaussianBlur(feather))
    bg = Image.new("RGB", (W, H), im.getpixel((2, 2)))
    return Image.composite(im, bg, mask)


HORSE = [
    (-46,   1), (-44,  11), (-37,  17), (-26,  21), (-15,  27),   # muzzle, lip, chin, jaw
    ( -5,  37), (  3,  54), ( 34,  54),                            # throat → neck front → base
    ( 32,  28), ( 27,   4), ( 22, -16), ( 17, -31), ( 13, -40),    # neck back → crest → poll
    (  9, -46), (  4, -66), (  0, -45),                            # ear
    ( -7, -41), (-17, -33), (-29, -21), (-39,  -9),                # forehead → face → nose
]

def horse_mark(size, fill):
    """The horse's head from the rescue's own logo, as a solid mark."""
    im = Image.new("RGBA", (size, size), (0,0,0,0)); d = ImageDraw.Draw(im)
    s = size / 118.0; c = size / 2
    d.polygon([(c + x*s, c + y*s) for x, y in HORSE], fill=fill)
    return im

def art_patch(W, H, logo_path="shots/logo.png",
              base=(232, 227, 218), edge=(150, 143, 132)):
    """A woven bone patch carrying the rescue's own logo, unaltered."""
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    r = int(min(W, H) * .14)
    d.rounded_rectangle([0, 0, W - 1, H - 1], radius=r, fill=base + (255,))
    d.rounded_rectangle([int(W*.05), int(H*.05), int(W*.95), int(H*.95)],
                        radius=int(r*.78), outline=edge + (200,), width=max(2, W//110))
    logo = Image.open(logo_path).convert("RGBA")
    s = min(W * .78 / logo.width, H * .78 / logo.height)
    logo = logo.resize((int(logo.width*s), int(logo.height*s)), Image.LANCZOS)
    im.alpha_composite(logo, ((W - logo.width)//2, (H - logo.height)//2))
    return im

def paste_patch(garment, patch, box, shadow=.45):
    """Drop an opaque patch onto the garment, with a soft contact shadow."""
    g = garment.convert("RGB"); W, H = g.size
    l, t, r, b = [int(v * s) for v, s in zip(box, (W, H, W, H))]
    p = patch.resize((r - l, b - t), Image.LANCZOS)
    if shadow > 0:
        sh = Image.new("L", (W, H), 0)
        ImageDraw.Draw(sh).rounded_rectangle([l+4, t+6, r+4, b+8],
                        radius=int((r-l)*.13), fill=int(255*shadow))
        sh = sh.filter(ImageFilter.GaussianBlur((r-l)*.045))
        g = Image.composite(Image.new("RGB", (W, H), (0,0,0)), g, sh)
    g.paste(p, (l, t), p)
    return g

def art_hay(W, H, ink=None):
    """Hay. Water. Time. — the three things, in the order everyone gets wrong."""
    im = Image.new("L", (W, H), 0); d = ImageDraw.Draw(im)
    f = geo(int(H * .215))
    for i, word in enumerate(("HAY.", "WATER.", "TIME.")):
        d.text((int(W * .045), int(H * (.115 + i * .245))), word, font=f, fill=255, anchor="lm")
    d.line([(W*.045, H*.79), (W*.62, H*.79)], fill=140, width=max(2, W//360))
    tracked(d, (W*.045, H*.865), "IN THAT ORDER.", mono(int(H*.072)), 230, track=int(W*.020), anchor="lm")
    tracked(d, (W*.045, H*.955), "NAMASTE EQUINE RESCUE · UNION GROVE, WI",
            mono(int(H*.045)), 150, track=int(W*.0045), anchor="lm")
    return im


def heal(im, box, dx=0, dy=0, feather=6):
    """Cover a mark by cloning clean fabric from (dx, dy) away."""
    im = im.convert("RGB"); W, H = im.size
    l, t, r, b = [int(v * s) for v, s in zip(box, (W, H, W, H))]
    src = im.crop((l + dx, t + dy, r + dx, b + dy))
    mask = Image.new("L", (r - l, b - t), 0)
    ImageDraw.Draw(mask).rectangle([feather, feather, r - l - feather, b - t - feather], fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(feather * .8))
    im.paste(src, (l, t), mask)
    return im
