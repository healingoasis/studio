#!/usr/bin/env python3
"""Inline the rescue's photographs into the site concept and write the publishable file."""
import base64, pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC  = ROOT / "content/concepts/namaste-site-source.html"
ASSETS = ROOT / "content/concepts/assets"
OUT = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "tmp/namaste-site.html"

IMAGES = {
    "LOGO":    "web/00-namaste-equine-rescue-logo-a-horse-s-hea.png",
    "HERO":    "web/01-captain-a-black-quarter-horse-walking-in.jpg",
    "RED":     "web/02-red-a-chestnut-quarter-horse-with-a-whit.jpg",
    "CAPTAIN": "web/03-captain-a-black-horse-walking-sound-and.jpg",
}
# product mockups: real garment photography with the rescue's artwork printed on
for _k in ("crew", "tee", "beanie", "tote", "stickers"):
    IMAGES[f"SHOT_{_k.upper()}"] = f"products/shot-{_k}.jpg"
    IMAGES[f"ART_{_k.upper()}"]  = f"products/art-{_k}.jpg"

html = SRC.read_text()
for key, name in IMAGES.items():
    path = ASSETS / name
    if not path.exists():
        sys.exit(f"missing image: {path}")
    html = html.replace("{{%s}}" % key, base64.b64encode(path.read_bytes()).decode())

left = [k for k in IMAGES if "{{%s}}" % k in html]
if left:
    sys.exit(f"unreplaced placeholders: {left}")

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(html)
print(f"{OUT}  {len(html)/1024/1024:.2f} MB")
