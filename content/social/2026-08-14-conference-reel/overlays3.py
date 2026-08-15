import base64, subprocess, os
LOGO = base64.b64encode(open('logo_ho.png','rb').read()).decode()

BASE = """<html><head><meta charset="utf-8"><style>
* {margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;background:transparent}
body{font-family:"Avenir Next","Helvetica Neue",Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased}
.stage{position:relative;width:1080px;height:1920px;overflow:hidden}
.wash{position:absolute;left:0;right:0;bottom:290px;height:840px;
  background:linear-gradient(180deg,rgba(10,4,4,0) 0%,rgba(10,4,4,.32) 30%,
             rgba(10,4,4,.70) 62%,rgba(10,4,4,.76) 84%,rgba(10,4,4,0) 100%)}
.cap{position:absolute;left:70px;right:70px;bottom:430px;text-align:center}
.cap .t{color:#fff;line-height:1.04;font-weight:700;letter-spacing:-.03em;
  text-shadow:0 5px 34px rgba(0,0,0,.94), 0 2px 8px rgba(0,0,0,.75)}
.cap .t b{color:#FF7A61}
</style></head><body><div class="stage">{BODY}</div></body></html>"""

def caption(main, size=86):
    return BASE.replace("{BODY}",
        f'<div class="wash"></div><div class="cap">'
        f'<div class="t" style="font-size:{size}px">{main}</div></div>')

CAPS = [
    ("q01", "This filled up<br><b>last year.</b>", 86),
    ("q02", "You probably<br>weren&rsquo;t in it.", 86),
    ("q03", "It happens again<br><b>in October.</b>", 82),
    ("q04", "<b>Three days.</b><br>Sixteen speakers.", 82),
    ("q05", "Canine and<br>equine tracks.", 86),
    ("q06", "Human and animal,<br>side by side.", 76),
    ("q07", "Hands on.<br>Not just slides.", 86),
    ("q08", "An exhibit hall<br>you&rsquo;ll actually use.", 76),
    ("q09", "Gear you can<br>put your hands on.", 76),
    ("q10", "Can&rsquo;t travel?<br><b>Watch it live.</b>", 86),
    ("q11", "Same CE credit<br>at home.", 86),
    ("q12", "<b>Don&rsquo;t miss it twice.</b>", 82),
]
overlays = {n: caption(m, s) for n, m, s in CAPS}

overlays["qend"] = BASE.replace("{BODY}",
    '<div style="position:absolute;inset:0;background:#1B0E0D"></div>'
    '<div style="position:absolute;left:66px;right:66px;top:300px;text-align:center">'
    f'<img src="data:image/png;base64,{LOGO}" style="width:140px;height:140px;border-radius:16px">'
    '<div style="color:#F3C9C0;font-size:24px;font-weight:600;letter-spacing:.20em;'
    'text-transform:uppercase;margin-top:26px">2026 Healing Oasis Conference</div>'
    '<div style="color:#fff;font-size:82px;font-weight:800;letter-spacing:-.035em;'
    'line-height:1.0;margin-top:34px">Resilience<br>in Motion</div>'
    '<div style="display:inline-block;background:#8B0000;color:#fff;font-size:42px;'
    'font-weight:800;padding:22px 34px;border-radius:8px;margin-top:44px;line-height:1.2;'
    'letter-spacing:-.015em">October 23&ndash;25<span style="display:block;font-size:26px;'
    'font-weight:600;color:#FFD9CF;margin-top:6px;letter-spacing:0">Lombard, IL &middot; or live from anywhere</span></div>'
    '<div style="color:#F0E4E1;font-size:31px;font-weight:600;margin-top:40px">'
    'Registration closes October 12</div>'
    '<div style="color:#fff;font-size:60px;font-weight:800;margin-top:44px;'
    'letter-spacing:-.02em">healingoasis.edu</div>'
    '<div style="color:#F0A9A0;font-size:32px;font-weight:600;margin-top:14px">262-898-1680</div>'
    '</div>')

os.makedirs('ov3', exist_ok=True)
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
for name, html in overlays.items():
    open(f'ov3/{name}.html','w').write(html)
    subprocess.run([CHROME,"--headless=new","--disable-gpu","--hide-scrollbars",
        "--default-background-color=00000000","--window-size=1080,1920",
        f"--screenshot=ov3/{name}.png", f"ov3/{name}.html"], capture_output=True)
print("rendered", len(overlays))
