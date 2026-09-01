// Renders the forty teaching cards. Each is a single 1080x1350 post — the
// format suits the job: one idea, screenshot-able, saveable. Nothing under 34px.
import { writeFileSync, mkdirSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { CARDS, SPEAKERS } from './cards.mjs'

const FONTS = 'https://fonts.googleapis.com/css2?family=Bitter:ital,wght@0,400;0,700;0,900;1,700&family=Manrope:wght@500;600;700;800&display=swap'
const LINK = 'healingoasis.edu/conference-2026/attend'

// Six palettes, rotated so no two consecutive cards look alike.
const PAL = {
  maroon: { bg:'#5c0101', ink:'#ffffff', sub:'rgba(245,236,223,0.86)', acc:'#e8a06a', rule:'rgba(245,236,223,0.26)', chip:'#f5ecdf', chipInk:'#5c0101' },
  navy:   { bg:'#1b2a3d', ink:'#ffffff', sub:'rgba(226,236,248,0.84)', acc:'#e2b48a', rule:'rgba(226,236,248,0.24)', chip:'#e8dcc8', chipInk:'#1b2a3d' },
  ox:     { bg:'#3d0505', ink:'#f5ecdf', sub:'rgba(245,236,223,0.82)', acc:'#dfb08a', rule:'rgba(245,236,223,0.22)', chip:'#f5ecdf', chipInk:'#3d0505' },
  sand:   { bg:'#e9dcc6', ink:'#2a1512', sub:'#6b5550',                acc:'#a8461f', rule:'rgba(42,21,18,0.18)',    chip:'#5c0101', chipInk:'#ffffff' },
  bone:   { bg:'#f3efe6', ink:'#1f1412', sub:'#63594f',                acc:'#a8461f', rule:'rgba(31,20,18,0.16)',    chip:'#5c0101', chipInk:'#ffffff' },
  ink:    { bg:'#14100e', ink:'#ffffff', sub:'rgba(255,255,255,0.76)', acc:'#d98a55', rule:'rgba(255,255,255,0.18)', chip:'#f5ecdf', chipInk:'#14100e' },
  clay:   { bg:'#7a3320', ink:'#ffffff', sub:'rgba(255,244,238,0.86)', acc:'#f0dcc0', rule:'rgba(255,255,255,0.24)', chip:'#fff4ee', chipInk:'#7a3320' },
}

const T = { h1: 96, h2: 76, lead: 54, body: 46, label: 34 }

const head = (p, tag) => `
  <div style="position:absolute;top:52px;left:60px;right:60px;display:flex;align-items:center;justify-content:space-between;gap:20px">
    <div style="display:flex;align-items:center;gap:14px">
      <div style="width:52px;height:52px;border-radius:50%;background:#f5ecdf;display:flex;align-items:center;justify-content:center;flex-shrink:0">
        <img src="../../img/logo.png" alt="" style="width:44px;display:block">
      </div>
      <div style="font-size:${T.label}px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:${p.ink};line-height:1.35">2026 Homecoming<br>Conference</div>
    </div>
    <div style="font-size:${T.label}px;font-weight:800;letter-spacing:0.09em;text-transform:uppercase;color:${p.acc};text-align:right;max-width:420px;line-height:1.35">${tag}</div>
  </div>`

const foot = (p, s, co) => {
  const [f, name, cred] = s
  const second = co ? SPEAKERS[co] : null
  return `
  <div style="position:absolute;left:60px;right:60px;bottom:140px;padding-top:26px;border-top:2px solid ${p.rule};display:flex;align-items:center;gap:20px">
    <div style="display:flex;flex-shrink:0">
      <img src="../../img/heads/${f}.jpg" alt="" style="width:96px;height:96px;border-radius:50%;object-fit:cover;object-position:50% 26%;border:3px solid ${p.acc}">
      ${second ? `<img src="../../img/heads/${second[0]}.jpg" alt="" style="width:96px;height:96px;border-radius:50%;object-fit:cover;object-position:50% 26%;border:3px solid ${p.acc};margin-left:-26px">` : ''}
    </div>
    <div>
      <div style="font-size:${T.body - 4}px;font-weight:800;color:${p.ink};line-height:1.1">${name}${second ? ` &amp; ${second[1]}` : ''}</div>
      <div style="font-size:${T.label}px;font-weight:700;color:${p.acc};margin-top:6px;line-height:1.2">${cred}</div>
    </div>
  </div>
  <div style="position:absolute;left:60px;right:60px;bottom:50px;display:flex;align-items:center;justify-content:space-between;gap:20px">
    <div style="font-size:${T.label}px;font-weight:800;color:${p.ink};white-space:nowrap">${LINK}</div>
    <div style="background:${p.chip};color:${p.chipInk};border-radius:4px;padding:10px 18px;font-size:${T.label}px;font-weight:800;letter-spacing:0.06em;white-space:nowrap">OCT 23&ndash;25</div>
  </div>`
}

const body = (c, p) => {
  if (c.kind === 'claim') return `
    <h1 style="font-family:'Bitter',Georgia,serif;font-weight:900;font-size:${c.size || T.h1}px;line-height:0.98;letter-spacing:-0.035em;color:${p.ink}">${c.big}</h1>
    <p style="margin-top:34px;font-size:${T.lead}px;line-height:1.3;font-weight:600;color:${p.sub}">${c.sub}</p>`

  if (c.kind === 'ask') return `
    <div style="font-size:${T.label}px;font-weight:800;letter-spacing:0.22em;text-transform:uppercase;color:${p.acc};margin-bottom:26px">A question from the program</div>
    <h1 style="font-family:'Bitter',Georgia,serif;font-style:italic;font-weight:700;font-size:${c.size || T.h2 + 8}px;line-height:1.04;letter-spacing:-0.03em;color:${p.ink}">${c.q}</h1>
    <div style="margin-top:32px;width:90px;height:4px;background:${p.acc}"></div>
    <p style="margin-top:32px;font-size:${T.lead}px;line-height:1.3;font-weight:600;color:${p.sub}">${c.a}</p>`

  if (c.kind === 'versus') return `
    <div style="font-size:${T.label}px;font-weight:800;letter-spacing:0.22em;text-transform:uppercase;color:${p.sub};margin-bottom:18px">Not</div>
    <div style="font-family:'Bitter',Georgia,serif;font-weight:700;font-size:${T.h2}px;line-height:1.02;letter-spacing:-0.03em;color:${p.sub};text-decoration:line-through;text-decoration-thickness:3px">${c.not}</div>
    <div style="margin-top:34px;font-size:${T.label}px;font-weight:800;letter-spacing:0.22em;text-transform:uppercase;color:${p.acc};margin-bottom:16px">But</div>
    <div style="font-family:'Bitter',Georgia,serif;font-weight:900;font-size:${T.h1 - 6}px;line-height:1.0;letter-spacing:-0.035em;color:${p.ink}">${c.is}</div>
    <p style="margin-top:32px;font-size:${T.body}px;line-height:1.34;font-weight:600;color:${p.sub}">${c.sub}</p>`

  if (c.kind === 'list') return `
    <div style="font-family:'Bitter',Georgia,serif;font-weight:700;font-size:${T.h2 - 6}px;line-height:1.06;letter-spacing:-0.03em;color:${p.ink}">${c.lead}</div>
    <div style="margin-top:44px">
      ${c.items.map((it, i) => `
        <div style="display:flex;gap:26px;align-items:baseline;padding:24px 0;${i ? `border-top:2px solid ${p.rule};` : ''}">
          <div style="font-family:'Bitter',Georgia,serif;font-size:${T.h2 - 14}px;font-weight:900;color:${p.acc};line-height:1;width:76px;flex-shrink:0">${i + 1}</div>
          <div style="font-size:${T.lead - 2}px;font-weight:800;line-height:1.14;color:${p.ink};letter-spacing:-0.015em">${it}</div>
        </div>`).join('')}
    </div>`

  if (c.kind === 'case') return `
    <div style="font-size:${T.label}px;font-weight:800;letter-spacing:0.22em;text-transform:uppercase;color:${p.acc};margin-bottom:26px">${c.lead}</div>
    <p style="font-family:'Bitter',Georgia,serif;font-size:${T.h2 - 12}px;line-height:1.22;font-weight:400;color:${p.ink};letter-spacing:-0.015em">${c.body}</p>`

  return ''
}

// One card's page, on its own, so a single card can be rebuilt without running the set —
// which is what the portal does when the office corrects a word.
export const cardHtml = (c) => {
  const p = PAL[c.pal]
  const s = SPEAKERS[c.by]
  return `<!doctype html>
<html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
<style>
  html,body{margin:0;padding:0;background:${p.bg}} *{box-sizing:border-box}
  .s{width:1080px;height:1350px;position:relative;overflow:hidden;background:${p.bg};
     font-family:'Manrope','Helvetica Neue',Arial,sans-serif}
  h1,p{margin:0}
</style></head><body><div class="s">
${head(p, c.tag)}
<div style="position:absolute;left:60px;right:60px;top:230px;bottom:290px;display:flex;flex-direction:column;justify-content:center">
${body(c, p)}
</div>
${foot(p, s, c.co)}
</div></body></html>
`
}

// Only when run directly. Importing this for `cardHtml` alone — which the portal does to rebuild
// a single corrected card — must not rewrite all forty files or print anything.
if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  mkdirSync(new URL('./out/', import.meta.url), { recursive: true })
  for (const c of CARDS) {
    writeFileSync(new URL(`./out/${c.id}_${c.by}.html`, import.meta.url), cardHtml(c))
  }
  console.log(`${CARDS.length} teaching cards`)
}
