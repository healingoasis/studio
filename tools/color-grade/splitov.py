import subprocess
html = """<html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1920px;height:1080px;background:transparent}
body{font-family:"Avenir Next",Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased}
.st{position:relative;width:1920px;height:1080px}
.div{position:absolute;left:957px;top:0;width:6px;height:1080px;background:#fff;
     box-shadow:0 0 22px rgba(0,0,0,.75)}
.lab{position:absolute;top:44px;font-size:30px;font-weight:800;letter-spacing:.14em;
     text-transform:uppercase;color:#fff;padding:14px 22px;border-radius:4px}
.l{left:44px;background:rgba(0,0,0,.72)}
.r{right:44px;background:#1f7a3d}
</style></head><body><div class="st">
<div class="lab l">Straight out of camera</div>
<div class="lab r">Graded</div>
<div class="div"></div>
</div></body></html>"""
open('splitov.html','w').write(html)
subprocess.run(["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome","--headless=new",
  "--disable-gpu","--hide-scrollbars","--default-background-color=00000000",
  "--window-size=1920,1080","--screenshot=splitov.png","splitov.html"],capture_output=True)
print("overlay rendered")
