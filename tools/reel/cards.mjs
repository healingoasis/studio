// Renders the reel's text cards as 1080x1920 PNGs. Overlay cards keep a
// transparent background so they sit on the footage; full cards paint their own.
import { writeFileSync, mkdirSync } from 'node:fs'

const FONTS = 'https://fonts.googleapis.com/css2?family=Bitter:wght@400;700;900&family=Manrope:wght@600;700;800&display=swap'
const MAROON = '#5c0101', CREAM = '#f5ecdf', EMBER = '#e8a06a'

// Type is sized for a phone held at arm's length: a reel is watched small and
// fast, so the floor here is higher than for a feed graphic.
const page = (body, bg = 'transparent') => `<!doctype html>
<html><head><meta charset="utf-8">
<link rel="stylesheet" href="${FONTS}">
<style>
  html,body{margin:0;padding:0;background:${bg}}
  *{box-sizing:border-box}
  .s{width:1080px;height:1920px;position:relative;overflow:hidden;
     font-family:'Manrope','Helvetica Neue',Arial,sans-serif}
  h1,h2,p{margin:0}
</style></head><body><div class="s">${body}</div></body></html>`

const scrim = (from = 0.86) => `
  <div style="position:absolute;left:0;right:0;bottom:0;height:1100px;
    background:linear-gradient(180deg,rgba(12,6,6,0) 0%,rgba(12,6,6,${from * 0.55}) 45%,rgba(12,6,6,${from}) 100%)"></div>`

const badge = `
  <div style="position:absolute;top:120px;left:0;right:0;display:flex;justify-content:center">
    <div style="background:rgba(12,6,6,0.55);border:2px solid rgba(245,236,223,0.35);border-radius:100px;
      padding:16px 34px;font-size:34px;font-weight:800;letter-spacing:0.22em;text-transform:uppercase;color:${CREAM}">
      Healing Oasis
    </div>
  </div>`

const CARDS = {
  // --- overlays, transparent, sit on footage ---
  hook: page(`${scrim(0.9)}${badge}
    <div style="position:absolute;left:70px;right:70px;bottom:260px">
      <h1 style="font-family:'Bitter',Georgia,serif;font-weight:900;font-size:118px;line-height:0.98;
        letter-spacing:-0.035em;color:#fff;text-shadow:0 6px 40px rgba(0,0,0,0.5)">
        Every one of<br>these dogs is<br>standing on the<br>same thing.</h1>
    </div>`),

  still: page(`${scrim(0.72)}
    <div style="position:absolute;left:70px;right:70px;bottom:230px">
      <div style="font-family:'Bitter',Georgia,serif;font-weight:700;font-size:86px;line-height:1.0;
        color:#fff;text-shadow:0 6px 40px rgba(0,0,0,0.5)">Still the same one.</div>
      <div style="margin-top:22px;font-size:46px;font-weight:700;color:${EMBER}">Four colors. One bolster.</div>
    </div>`),

  hands: page(`${scrim(0.78)}
    <div style="position:absolute;left:70px;right:70px;bottom:240px">
      <div style="font-family:'Bitter',Georgia,serif;font-weight:700;font-size:92px;line-height:1.0;
        color:#fff;text-shadow:0 6px 40px rgba(0,0,0,0.5)">It holds the animal<br>so your hands<br>are free.</div>
    </div>`),


  stand: page(`${scrim(0.76)}
    <div style="position:absolute;left:70px;right:70px;bottom:240px">
      <div style="font-family:'Bitter',Georgia,serif;font-weight:700;font-size:96px;line-height:1.0;
        color:#fff;text-shadow:0 6px 40px rgba(0,0,0,0.5)">Firm enough<br>to stand on.</div>
      <div style="margin-top:22px;font-size:46px;font-weight:700;color:${EMBER}">Which is how you reach a horse's back.</div>
    </div>`),

  // --- full cards ---
  reveal: page(`
    <div style="position:absolute;inset:0;background:${MAROON}"></div>
    <div style="position:absolute;left:80px;right:80px;top:50%;transform:translateY(-50%)">
      <div style="font-size:40px;font-weight:800;letter-spacing:0.28em;text-transform:uppercase;color:${EMBER}">It has a name</div>
      <h1 style="margin-top:34px;font-family:'Bitter',Georgia,serif;font-weight:900;font-size:220px;line-height:0.86;
        letter-spacing:-0.05em;color:#fff">The<br>Bale.</h1>
      <p style="margin-top:44px;font-size:56px;line-height:1.26;font-weight:700;color:rgba(245,236,223,0.92)">
        A firm foam bolster that puts the patient exactly where you need it &mdash; and keeps it there.</p>
    </div>`, MAROON),

  uses: page(`
    <div style="position:absolute;inset:0;background:#1a0808"></div>
    <div style="position:absolute;left:80px;right:80px;top:50%;transform:translateY(-50%)">
      <div style="font-size:40px;font-weight:800;letter-spacing:0.26em;text-transform:uppercase;color:${EMBER}">Made for</div>
      <div style="margin-top:44px">
        ${['Spinal manipulation', 'Chiropractic adjustment', 'Rehabilitation', 'Acupuncture support', 'Grooming and massage']
          .map((t, i) => `<div style="font-family:'Bitter',Georgia,serif;font-weight:700;font-size:76px;line-height:1.0;
            color:#fff;padding:28px 0;${i ? 'border-top:2px solid rgba(245,236,223,0.22);' : ''}">${t}</div>`).join('')}
      </div>
      <p style="margin-top:38px;font-size:44px;line-height:1.3;font-weight:700;color:rgba(245,236,223,0.72)">
        Small dogs. Large breeds. Equine patients.</p>
    </div>`, '#1a0808'),

  specs: page(`
    <div style="position:absolute;inset:0;background:${CREAM}"></div>
    <div style="position:absolute;left:80px;right:80px;top:50%;transform:translateY(-50%)">
      <div style="font-size:40px;font-weight:800;letter-spacing:0.26em;text-transform:uppercase;color:#a8461f">The specification</div>
      <div style="margin-top:40px">
        ${[['24&Prime; &times; 16&Prime; &times; 36&Prime;', 'height, width, length'],
           ['High-density foam', 'shape-retaining core'],
           ['Wipe-clean vinyl', 'durable cover'],
           ['Made in the USA', 'the same core we have used since 1998']]
          .map(([a, b], i) => `<div style="padding:26px 0;${i ? 'border-top:2px solid rgba(92,1,1,0.18);' : ''}">
            <div style="font-family:'Bitter',Georgia,serif;font-weight:700;font-size:66px;line-height:1.0;color:#2a1512">${a}</div>
            <div style="margin-top:12px;font-size:42px;font-weight:700;color:#6b5550">${b}</div>
          </div>`).join('')}
      </div>
      <div style="margin-top:36px;display:flex;gap:18px;align-items:center">
        ${['#6b3fa0', '#2f7d4f', '#141414', '#2f4a8c'].map(c =>
          `<div style="width:96px;height:96px;border-radius:14px;background:${c}"></div>`).join('')}
        <div style="font-size:40px;font-weight:800;color:#6b5550;margin-left:8px">Four colors</div>
      </div>
    </div>`, CREAM),

  cta: page(`
    <div style="position:absolute;inset:0;background:${MAROON}"></div>
    <div style="position:absolute;left:80px;right:80px;top:50%;transform:translateY(-50%);text-align:center">
      <h1 style="font-family:'Bitter',Georgia,serif;font-weight:900;font-size:138px;line-height:0.92;
        letter-spacing:-0.04em;color:#fff">Put your<br>patient where<br>you need it.</h1>
      <div style="margin:56px auto 0;width:180px;height:5px;background:${EMBER}"></div>
      <div style="margin-top:52px;font-size:60px;font-weight:800;color:${CREAM}">healingoasis.edu</div>
      <div style="margin-top:20px;font-size:44px;font-weight:700;color:rgba(245,236,223,0.72)">Shop &rarr; Bales</div>
    </div>`, MAROON),
}

mkdirSync(new URL('./cards/', import.meta.url), { recursive: true })
for (const [name, html] of Object.entries(CARDS)) {
  writeFileSync(new URL(`./cards/${name}.html`, import.meta.url), html)
  console.log(name)
}
