import base64, subprocess, os
LOGO = base64.b64encode(open('logo_ho.png','rb').read()).decode()

BASE = """<html><head><meta charset="utf-8"><style>
* {margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;background:transparent}
body{font-family:"Avenir Next","Helvetica Neue",Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased}
.stage{position:relative;width:1080px;height:1920px;overflow:hidden}
.wash{position:absolute;left:0;right:0;bottom:270px;height:760px;
  background:linear-gradient(180deg,rgba(8,4,4,0) 0%,rgba(8,4,4,.26) 26%,
             rgba(8,4,4,.62) 58%,rgba(8,4,4,.70) 82%,rgba(8,4,4,0) 100%)}
.cap{position:absolute;left:78px;right:78px;bottom:452px;text-align:center}
.rule{width:64px;height:5px;background:#C2402A;border-radius:3px;margin:0 auto 26px}
.cap .t{color:#fff;line-height:1.06;font-weight:600;letter-spacing:-.022em;
  text-shadow:0 4px 30px rgba(0,0,0,.92), 0 1px 4px rgba(0,0,0,.6)}
.cap .t b{font-weight:800;color:#FF8A6B}
</style></head><body><div class="stage">{BODY}</div></body></html>"""

def caption(main, size=78):
    return BASE.replace("{BODY}",
        f'<div class="wash"></div><div class="cap"><div class="rule"></div>'
        f'<div class="t" style="font-size:{size}px">{main}</div></div>')

CAPS = [
    ("r01", "This filled up<br><b>last year.</b>", 82),
    ("r02", "You probably<br>weren&rsquo;t in it.", 82),
    ("r03", "It happens again<br><b>in October.</b>", 78),
    ("r04", "<b>Three days.</b><br>Sixteen speakers.", 78),
    ("r05", "Canine and<br>equine tracks.", 82),
    ("r06", "Human and animal,<br>side by side.", 72),
    ("r07", "Hands on.<br>Not just slides.", 82),
    ("r08", "An exhibit hall<br>you&rsquo;ll actually use.", 72),
    ("r09", "Can&rsquo;t travel?<br><b>Watch it live.</b>", 82),
    ("r10", "Same CE credit<br>at home.", 82),
    ("r11", "<b>Don&rsquo;t miss it twice.</b>", 78),
]
overlays = {n: caption(m, s) for n, m, s in CAPS}

# soft cinematic vignette, applied for the whole reel
overlays["vign"] = BASE.replace("{BODY}",
    '<div style="position:absolute;inset:0;background:'
    'radial-gradient(120% 78% at 50% 44%, rgba(0,0,0,0) 42%, rgba(0,0,0,.20) 74%, rgba(0,0,0,.46) 100%)"></div>')

overlays["rend"] = BASE.replace("{BODY}",
    '<div style="position:absolute;inset:0;background:#1B0E0D"></div>'
    '<div style="position:absolute;left:66px;right:66px;top:322px;text-align:center">'
    f'<img src="data:image/png;base64,{LOGO}" style="width:134px;height:134px;border-radius:16px">'
    '<div style="color:#EFC7BE;font-size:23px;font-weight:600;letter-spacing:.22em;'
    'text-transform:uppercase;margin-top:26px">2026 Healing Oasis Conference</div>'
    '<div style="color:#fff;font-size:80px;font-weight:800;letter-spacing:-.035em;'
    'line-height:1.0;margin-top:32px">Resilience<br>in Motion</div>'
    '<div style="width:70px;height:5px;background:#C2402A;border-radius:3px;margin:38px auto 0"></div>'
    '<div style="color:#fff;font-size:46px;font-weight:800;margin-top:38px;letter-spacing:-.02em">'
    'October 23&ndash;25, 2026</div>'
    '<div style="color:#E8D6D2;font-size:29px;font-weight:500;margin-top:12px">'
    'Lombard, Illinois &mdash; or live from anywhere</div>'
    '<div style="display:inline-block;background:#8B0000;color:#fff;font-size:29px;'
    'font-weight:700;padding:16px 26px;border-radius:6px;margin-top:34px;letter-spacing:-.005em">'
    'Registration closes October 12</div>'
    '<div style="color:#fff;font-size:58px;font-weight:800;margin-top:44px;'
    'letter-spacing:-.02em">healingoasis.edu</div>'
    '<div style="color:#EFA396;font-size:31px;font-weight:600;margin-top:14px">262-898-1680</div>'
    '</div>')

os.makedirs('ov4', exist_ok=True)
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
for name, html in overlays.items():
    open(f'ov4/{name}.html','w').write(html)
    subprocess.run([CHROME,"--headless=new","--disable-gpu","--hide-scrollbars",
        "--default-background-color=00000000","--window-size=1080,1920",
        f"--screenshot=ov4/{name}.png", f"ov4/{name}.html"], capture_output=True)
print("rendered", len(overlays))
