import base64, subprocess, os

LOGO = base64.b64encode(open('logo.png','rb').read()).decode()

BASE = """<html><head><meta charset="utf-8"><style>
* {margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;background:transparent}
body{font-family:"Avenir Next","Helvetica Neue",Helvetica,Arial,sans-serif;
     -webkit-font-smoothing:antialiased}
.stage{position:relative;width:1080px;height:1920px;overflow:hidden}
/* soft legibility wash behind the caption zone only */
.wash{position:absolute;left:0;right:0;bottom:300px;height:820px;
  background:linear-gradient(180deg,rgba(12,5,5,0) 0%,rgba(12,5,5,.30) 30%,
             rgba(12,5,5,.66) 62%,rgba(12,5,5,.72) 84%,rgba(12,5,5,0) 100%)}
.cap{position:absolute;left:70px;right:70px;bottom:440px;text-align:center}
.cap .t{color:#fff;font-size:88px;line-height:1.04;font-weight:700;letter-spacing:-.03em;
  text-shadow:0 5px 34px rgba(0,0,0,.92), 0 2px 8px rgba(0,0,0,.7)}
.cap .t b{color:#FF7A61}
.cap .s{color:#F0E4E1;font-size:37px;font-weight:600;margin-top:24px;letter-spacing:.005em;
  text-shadow:0 4px 20px rgba(0,0,0,.9)}
</style></head><body><div class="stage">{BODY}</div></body></html>"""

def caption(main, sub=None, size=88):
    s = f'<div class="s">{sub}</div>' if sub else ''
    return BASE.replace("{BODY}",
        f'<div class="wash"></div><div class="cap">'
        f'<div class="t" style="font-size:{size}px">{main}</div>{s}</div>')

CAPS = [
    ("k01", "She&rsquo;s not petting him.<br><b>She&rsquo;s reading his spine.</b>", None, 72),
    ("k02", "This is veterinary<br>spinal manipulation.", None, 88),
    ("k03", "<b>226 hours</b><br>of training.", "Five modules. Not a weekend course.", 88),
    ("k04", "Over <b>100 hours</b><br>hands-on.", None, 88),
    ("k05", "On real dogs<br>and horses.", None, 88),
    ("k06", "Not models.<br>Not videos.", None, 88),
    ("k07", "<b>3&ndash;4 students</b><br>per instructor.", None, 88),
    ("k08", "You&rsquo;re the one<br>with hands on.", "Every single practicum", 88),
    ("k09", "Five modules.<br>Four on campus.", None, 88),
    ("k10", "<b>AAVSB-RACE</b><br>approved CE.", None, 88),
    ("k11", "For licensed vets<br>&amp; chiropractors.", None, 88),
    ("k12", "<b>20 seats.</b><br>That&rsquo;s the whole class.", None, 88),
]

overlays = {name: caption(main, sub, size) for name, main, sub, size in CAPS}

# ---- end card ----
overlays["kend"] = BASE.replace("{BODY}",
    '<div style="position:absolute;inset:0;background:#1C0F0E"></div>'
    '<div style="position:absolute;left:70px;right:70px;top:330px;text-align:center">'
    f'<img src="data:image/png;base64,{LOGO}" style="width:150px;height:150px;border-radius:18px">'
    '<div style="color:#F3C9C0;font-size:25px;font-weight:600;letter-spacing:.20em;'
    'text-transform:uppercase;margin-top:28px">Healing Oasis Wellness Center</div>'
    '<div style="color:#fff;font-size:76px;font-weight:700;letter-spacing:-.03em;'
    'line-height:1.02;margin-top:40px">VSMT<br>Certification</div>'
    '<div style="display:inline-block;background:#8B0000;color:#fff;font-size:40px;'
    'font-weight:800;padding:22px 34px;border-radius:8px;margin-top:46px;line-height:1.22;'
    'letter-spacing:-.01em">Next class starts<br>January 13, 2027</div>'
    '<div style="color:#F0E4E1;font-size:33px;font-weight:600;margin-top:42px;line-height:1.5">'
    '20 seats &middot; $200 deposit holds yours</div>'
    '<div style="color:#fff;font-size:62px;font-weight:800;margin-top:56px;'
    'letter-spacing:-.02em">healingoasis.edu</div>'
    '<div style="color:#F0A9A0;font-size:33px;font-weight:600;margin-top:16px">262-898-1680</div>'
    '</div>')

os.makedirs('ov2', exist_ok=True)
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
for name, html in overlays.items():
    open(f'ov2/{name}.html','w').write(html)
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
                    "--default-background-color=00000000",
                    "--window-size=1080,1920", f"--screenshot=ov2/{name}.png",
                    f"ov2/{name}.html"], capture_output=True)
print("rendered", len(overlays), "overlays")
