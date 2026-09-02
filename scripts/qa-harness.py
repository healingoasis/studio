import pathlib, subprocess, re, html
SRC = pathlib.Path("/Users/danielrivera/studio/apps/namaste-site/index.html").read_text()
CH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

def run(name, script, route="/", theme="light", w=1360, h=1000, budget=25000):
    page = SRC + """
<script>
var LOG=[];
function ok(c,m){ LOG.push((c?"PASS  ":"FAIL  ")+m) }
function finish(){ var p=document.createElement('pre'); p.id='qa'; p.textContent=LOG.join('\\n');
                   document.body.appendChild(p) }
window.addEventListener('error',function(e){ LOG.push('FAIL  uncaught: '+e.message) });
setTimeout(function(){
  var r=document.documentElement; r.setAttribute('data-theme','%s'); r.style.colorScheme='%s';
  try{ %s }catch(e){ LOG.push('FAIL  threw: '+e.message); finish() }
},1100);
</script>""" % (theme, theme, script)
    f = pathlib.Path("qa_%s.html" % name); f.write_text(page)
    p = subprocess.run([CH,"--headless","--disable-gpu","--virtual-time-budget=%d"%budget,
                        "--window-size=%d,%d"%(w,h),"--dump-dom",
                        "file://%s#%s"%(f.resolve(), route)], capture_output=True, text=True)
    m = re.search(r'<pre id="qa">(.*?)</pre>', p.stdout, re.S)
    return html.unescape(m.group(1)) if m else "FAIL  no output from harness"

def report(title, out):
    fails = [l for l in out.split("\n") if l.startswith("FAIL")]
    print("── %s ── %d checks, %d failed" % (title, len(out.split("\n")), len(fails)))
    for l in fails: print("   " + l)
    return len(fails)
