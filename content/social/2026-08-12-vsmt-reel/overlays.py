import base64, subprocess, os

LOGO = base64.b64encode(open('logo.png','rb').read()).decode()

BASE = """<html><head><meta charset="utf-8"><style>
* {margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;background:transparent}
body{font-family:"Avenir Next","Helvetica Neue",Helvetica,Arial,sans-serif;
     -webkit-font-smoothing:antialiased}
.stage{position:relative;width:1080px;height:1920px;overflow:hidden}
.scrim{position:absolute;left:0;right:0;bottom:0;height:900px;
  background:linear-gradient(180deg,rgba(15,6,6,0) 0%,rgba(15,6,6,.62) 42%,rgba(15,6,6,.92) 100%)}
.mark{position:absolute;top:74px;left:64px;display:flex;align-items:center;gap:18px}
.mark img{width:88px;height:88px;border-radius:10px}
.mark .n{color:#fff;font-size:25px;font-weight:700;letter-spacing:.05em;line-height:1.2;
  text-transform:uppercase;text-shadow:0 3px 16px rgba(0,0,0,.85)}
.mark .n span{display:block;font-size:16px;font-weight:500;letter-spacing:.17em;color:#F3C9C0}
.low{position:absolute;left:64px;right:64px;bottom:210px}
.chip{display:inline-block;background:#8B0000;color:#fff;font-size:26px;font-weight:700;
  letter-spacing:.16em;text-transform:uppercase;padding:15px 24px 13px;border-radius:4px;margin-bottom:28px}
h1{color:#fff;font-size:96px;line-height:.96;font-weight:700;letter-spacing:-.028em;
   text-shadow:0 4px 30px rgba(0,0,0,.8)}
.sub{color:#FFD9CF;font-size:42px;font-weight:600;margin-top:22px;letter-spacing:.005em;
   text-shadow:0 3px 18px rgba(0,0,0,.8)}
.cap{color:#fff;font-size:74px;line-height:1.06;font-weight:700;letter-spacing:-.02em;
   text-shadow:0 4px 26px rgba(0,0,0,.85)}
.cap b{color:#FF8A75}
.capsub{color:#EBD8D4;font-size:36px;font-weight:500;margin-top:20px;
   text-shadow:0 3px 18px rgba(0,0,0,.8)}
.bar{position:absolute;left:64px;bottom:150px;width:120px;height:8px;background:#8B0000;border-radius:4px}
</style></head><body><div class="stage">{BODY}</div></body></html>"""

MARK = f'<div class="mark"><img src="data:image/png;base64,{LOGO}"><div class="n">Healing Oasis<span>Wellness Center</span></div></div>'

def page(body):
    return BASE.replace("{BODY}", body)

overlays = {}

# always-on brand mark
overlays['mark'] = page(MARK)

# opening title
overlays['title'] = page(
    '<div class="scrim"></div>' + MARK +
    '<div class="low">'
    '<div class="chip">Now enrolling &middot; 2027 Spring class</div>'
    '<h1>Veterinary<br>Spinal<br>Manipulation</h1>'
    '<div class="sub">Postgraduate certification program</div>'
    '</div><div class="bar"></div>')

def caption(main, sub):
    return page('<div class="scrim"></div>' +
        f'<div class="low"><div class="cap">{main}</div><div class="capsub">{sub}</div></div>'
        '<div class="bar"></div>')

overlays['c1'] = caption('<b>226 hours</b> of<br>supervised education',
                         'Five modules, hybrid &mdash; four of them on campus')
overlays['c2'] = caption('Well over <b>100 hours</b><br>hands-on',
                         'Clinical lab work on real patients')
overlays['c3'] = caption('<b>3&ndash;4 students</b><br>per instructor',
                         'In every clinical practicum')
overlays['c4'] = caption('Maximum <b>20 students</b><br>per class',
                         'Seats go to those who apply early')

# end card (opaque)
overlays['end'] = page(
    '<div style="position:absolute;inset:0;background:#231413"></div>'
    '<div style="position:absolute;left:0;right:0;top:300px;text-align:center">'
    f'<img src="data:image/png;base64,{LOGO}" style="width:186px;height:186px;border-radius:20px">'
    '<div style="color:#F3C9C0;font-size:27px;font-weight:600;letter-spacing:.19em;'
    'text-transform:uppercase;margin-top:34px">Healing Oasis Wellness Center</div>'
    '<div style="color:#fff;font-size:82px;font-weight:700;letter-spacing:-.025em;'
    'line-height:1.02;margin-top:44px">VSMT<br>Certification</div>'
    '<div style="display:inline-block;background:#8B0000;color:#fff;font-size:36px;'
    'font-weight:700;padding:20px 32px;border-radius:6px;margin-top:48px;line-height:1.25">'
    'Next class begins<br>January 13, 2027</div>'
    '<div style="color:#EBD8D4;font-size:32px;font-weight:500;margin-top:44px;line-height:1.5">'
    'Only 20 seats &middot; $200 deposit holds yours<br>'
    'For licensed veterinarians &amp; chiropractors</div>'
    '<div style="color:#fff;font-size:56px;font-weight:700;margin-top:66px;'
    'letter-spacing:-.015em">healingoasis.edu</div>'
    '<div style="color:#F0A9A0;font-size:34px;font-weight:600;margin-top:18px">262-898-1680</div>'
    '</div>')

os.makedirs('ov', exist_ok=True)
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
for name, html in overlays.items():
    open(f'ov/{name}.html','w').write(html)
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
                    "--default-background-color=00000000",
                    "--window-size=1080,1920", f"--screenshot=ov/{name}.png",
                    f"ov/{name}.html"], capture_output=True)
    print(name, os.path.getsize(f'ov/{name}.png'))
