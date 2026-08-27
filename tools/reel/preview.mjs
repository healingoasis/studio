// Builds a self-contained preview page with the reel embedded, so it can be
// watched before anything is saved anywhere. The script does the base64 so the
// video never has to pass through a conversation.
import { readFileSync, writeFileSync } from 'node:fs'

const b64 = readFileSync(new URL('./bale-reel-preview.mp4', import.meta.url)).toString('base64')

const SHOTS = [
  ['0.0', 'Boxer on a blue bale, clinic', 'Hook: “Every one of these dogs is standing on the same thing.”'],
  ['2.6', 'Teal bale, hind limb work', ''],
  ['3.8', 'Purple bale, small dog', ''],
  ['5.0', 'Green bale, terrier', ''],
  ['6.2', 'Blue bale, cattle dog', '“Still the same one. Four colors, one bolster.”'],
  ['7.8', 'Card', 'The reveal — “The Bale.”'],
  ['10.3', 'Border collie, teal bale', '“It holds the animal so your hands are free.”'],
  ['12.3', 'Horse in the arena', '“Firm enough to stand on.” — the practitioner is standing on it'],
  ['14.5', 'Doberman, arena', ''],
  ['16.2', 'Card', 'What it is made for'],
  ['19.2', 'Blue bale, arena', ''],
  ['20.7', 'Blue bale, wash bucket', ''],
  ['22.1', 'Card', 'The specification, and the four colors'],
  ['25.1', 'Card', 'Where to buy'],
]

writeFileSync(new URL('./preview.html', import.meta.url), `<title>Bale Reel</title>
<style>
 :root{--bg:#faf6ef;--ink:#2a1512;--muted:#6b5550;--line:rgba(92,1,1,0.16);--acc:#a8461f;--card:#fff}
 @media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#17100e;--ink:#f5ecdf;--muted:#b19c95;--line:rgba(245,236,223,0.18);--acc:#e8a06a;--card:#211714}}
 :root[data-theme="dark"]{--bg:#17100e;--ink:#f5ecdf;--muted:#b19c95;--line:rgba(245,236,223,0.18);--acc:#e8a06a;--card:#211714}
 body{margin:0;background:var(--bg);color:var(--ink);font-family:'Manrope',ui-sans-serif,system-ui,-apple-system,'Helvetica Neue',Arial,sans-serif}
 .w{max-width:1120px;margin:0 auto;padding:48px 22px 90px}
 h1{font-family:Bitter,Georgia,serif;font-size:clamp(30px,4.6vw,48px);line-height:1.04;letter-spacing:-0.03em;margin:0 0 12px}
 .lede{font-size:17px;line-height:1.6;color:var(--muted);max-width:62ch;margin:0 0 34px}
 .lede strong{color:var(--ink)}
 .row{display:grid;grid-template-columns:minmax(260px,340px) 1fr;gap:40px;align-items:start}
 @media(max-width:760px){.row{grid-template-columns:1fr}}
 video{width:100%;border-radius:12px;background:#000;box-shadow:0 14px 44px rgba(0,0,0,0.28);display:block}
 .note{font-size:14px;color:var(--muted);margin-top:12px;line-height:1.5}
 h2{font-family:Bitter,Georgia,serif;font-size:22px;margin:0 0 14px;letter-spacing:-0.01em}
 table{border-collapse:collapse;width:100%;font-size:14.5px}
 td{padding:11px 10px 11px 0;border-bottom:1px solid var(--line);vertical-align:top;line-height:1.45}
 td.t{color:var(--acc);font-weight:800;white-space:nowrap;width:64px;font-variant-numeric:tabular-nums}
 td.s{font-weight:700;width:210px}
 td.n{color:var(--muted)}
 .flags{margin-top:34px;padding:20px 22px;background:var(--card);border-left:4px solid var(--acc);border-radius:0 6px 6px 0}
 .flags h3{margin:0 0 10px;font-size:15px;letter-spacing:0.04em;text-transform:uppercase;color:var(--acc)}
 .flags ul{margin:0;padding-left:18px}
 .flags li{font-size:14.5px;line-height:1.6;margin-bottom:9px;color:var(--muted)}
 .flags li b{color:var(--ink)}
</style>
<div class="w">
  <h1>The Bale &mdash; reel</h1>
  <p class="lede">27.5 seconds, 1080&times;1920, cut from your own VSMT and VMRT footage. <strong>Nothing has been saved to Drive.</strong> This is the preview only &mdash; the full-quality master sits on your Mac until you say otherwise.</p>

  <div class="row">
    <div>
      <video src="data:video/mp4;base64,${b64}" controls playsinline preload="metadata"></video>
      <p class="note">Preview encode, compressed to load in a browser. The master is 24&nbsp;MB at full bitrate.</p>
    </div>

    <div>
      <h2>The cut, shot by shot</h2>
      <table>
        ${SHOTS.map(([t, s, n]) => `<tr><td class="t">${t}s</td><td class="s">${s}</td><td class="n">${n}</td></tr>`).join('')}
      </table>

      <div class="flags">
        <h3>Three things to decide</h3>
        <ul>
          <li><b>There is no sound.</b> That is deliberate &mdash; add a trending audio track in Instagram itself when you post. Trending audio is one of the few things that reliably lifts reach, and it has to be chosen inside the app to count.</li>
          <li><b>Grooming, nail trimming and washing are named but not shown.</b> I have no footage of them on a bale. They appear on the &ldquo;made for&rdquo; card because your product page lists them &mdash; but a phone clip of each would let me show them instead of claiming them.</li>
          <li><b>The product page says the Black Bale is sold out.</b> Worth checking stock before this goes anywhere.</li>
        </ul>
      </div>
    </div>
  </div>
</div>
`)
console.log('preview.html written')
