"""
Packs the review page: the whole app inside one file that runs anywhere.

Reads what `build-review.sh` has already gathered into the work folder — the rendered
page, its stylesheet and scripts, and the photographs — and writes a single HTML file to
publish. Run it through the shell script rather than on its own.
"""

import base64, os, re, sys
from pathlib import Path

WORK = Path(os.environ.get("REVIEW_WORK", "tmp/review"))
ASSETS = WORK / "assets"
PHOTOS = WORK / "photos"

TRACE = "--trace" in sys.argv

# Two shapes of the same page. The published link needs the app inside a frame, because
# the host injects its own runtime into the page's head and the app will not hydrate
# around it. A file Daniel double-clicks has no host and no such problem, so it is the
# app's own document, straight — which is also the sturdier of the two.
AS_FILE = "--file" in sys.argv

# Two things the app assumes it has and a single published file does not.
#
# A base: the app is served from a blob, whose address nothing can be resolved against.
# Anything that works out a URL for itself fails without one.
#
# History: the router writes the address bar as it navigates. A blob document is not
# allowed to, and the refusal is thrown rather than returned, which is enough to stop the
# page dead the first time a version is switched. The review copy has one address and
# never leaves it, so there is nothing worth recording.
PREAMBLE = (
    '<base href="https://review.healingoasis.invalid/">'
    "<script>"
    "(function(){var n=function(){};try{history.replaceState=n;history.pushState=n;}catch(e){}})();"
    "</script>"
)

# Only with --trace: puts whatever the app throws on the page, since the published copy
# runs in a frame whose console is out of reach.
CATCH = """<script>
(function () {
  var box = null;
  function show(t) {
    if (!box) {
      box = document.createElement("pre");
      box.style.cssText = "position:fixed;z-index:99999;left:0;right:0;bottom:0;max-height:60vh;overflow:auto;margin:0;padding:10px;background:#3a0d0d;color:#ffd9d9;font:12px/1.45 ui-monospace,monospace;white-space:pre-wrap";
      (document.body || document.documentElement).appendChild(box);
    }
    box.textContent += t + "\\n\\n";
  }
  window.addEventListener("error", function (e) {
    show("ERROR: " + e.message + "\\n" + ((e.error && e.error.stack) || "").slice(0, 500));
  });
  window.addEventListener("unhandledrejection", function (e) {
    var r = e.reason;
    show("REJECTION: " + ((r && (r.stack || r.message)) || String(r)).slice(0, 500));
  });
})();
</script>"""


def asset(path: str) -> str:
    js = (ASSETS / path.replace("/", "_")).read_text(encoding="utf-8")
    # A raw U+FFFD sits in one polyfill's source. The publisher reads it as a broken file;
    # this escape means exactly the same thing to JavaScript.
    return js.replace("�", "\\ufffd")


photo_uri = {
    "/photos/" + f.name: "data:image/jpeg;base64," + base64.b64encode(f.read_bytes()).decode()
    for f in sorted(PHOTOS.iterdir())
}


def app_document() -> str:
    """The app as Next served it, with nothing left to fetch from anywhere."""
    html = (WORK / "review.html").read_text(encoding="utf-8")
    html = re.sub(r'<link[^>]*rel="(preload|preconnect)"[^>]*/?>', "", html)
    html = re.sub(
        r'<link[^>]*rel="stylesheet"[^>]*href="(/_next/static/css/[^"]+)"[^>]*/?>',
        lambda m: "<style>" + asset(m.group(1)) + "</style>",
        html,
    )
    html = re.sub(
        r'<script[^>]*src="(/_next/static/[^"]+)"[^>]*>\s*</script>',
        lambda m: "<script>" + asset(m.group(1)) + "</script>",
        html,
    )
    for path, uri in photo_uri.items():
        html = html.replace(path, uri)
    return html.replace("<head>", "<head>" + PREAMBLE + (CATCH if TRACE else ""), 1)


document = app_document()

if AS_FILE:
    out = WORK / "review-file.html"
    out.write_text(document, encoding="utf-8")
    print(f"{out}  {len(document) / 1024 / 1024:.2f} MB")
    sys.exit(0)

# For the published copy the frame has to be loaded from a blob: srcdoc gives the document
# no address of its own, and the app never finishes starting.
app = base64.b64encode(document.encode("utf-8")).decode("ascii")

page = """<title>Student Intake Portal</title>
<style>
  html, body { margin: 0; height: 100%; background: #171513; }
  iframe { display: block; width: 100%; height: 100vh; border: 0; }
</style>
<iframe id="app" title="Student Intake Portal"></iframe>
<script type="text/plain" id="app-html">__APP__</script>
<script>
  (function () {
    var raw = atob(document.getElementById("app-html").textContent.trim());
    var bytes = new Uint8Array(raw.length);
    for (var i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
    document.getElementById("app").src =
      URL.createObjectURL(new Blob([bytes], { type: "text/html" }));
  })();
</script>
""".replace("__APP__", app)

out = WORK / ("review-trace.html" if TRACE else "review-page.html")
out.write_text(page, encoding="utf-8")
print(f"{out}  {len(page) / 1024 / 1024:.2f} MB")
