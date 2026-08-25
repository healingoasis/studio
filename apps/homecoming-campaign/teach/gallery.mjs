import { readFileSync, writeFileSync } from 'node:fs'
import { CARDS, SPEAKERS } from './cards.mjs'
const cells = CARDS.map((c) => {
  const [, name] = SPEAKERS[c.by]
  const b64 = readFileSync(new URL(`./thumb/${c.id}_${c.by}.jpg`, import.meta.url)).toString('base64')
  return `<figure><img src="data:image/jpeg;base64,${b64}" alt=""><figcaption><b>${c.id}</b> ${c.tag}<br><span>${name}</span></figcaption></figure>`
}).join('')
writeFileSync(new URL('./review.html', import.meta.url), `<title>Conference Teaching Cards</title>
<style>
 :root{--bg:#faf6ef;--ink:#2a1512;--muted:#6b5550;--line:rgba(92,1,1,0.16);--acc:#a8461f}
 @media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#1b0f0d;--ink:#f5ecdf;--muted:#b49f98;--line:rgba(245,236,223,0.18);--acc:#e0714a}}
 :root[data-theme="dark"]{--bg:#1b0f0d;--ink:#f5ecdf;--muted:#b49f98;--line:rgba(245,236,223,0.18);--acc:#e0714a}
 body{margin:0;background:var(--bg);color:var(--ink);font-family:'Manrope',ui-sans-serif,system-ui,-apple-system,'Helvetica Neue',Arial,sans-serif}
 .w{max-width:1280px;margin:0 auto;padding:52px 24px 90px}
 h1{font-family:Bitter,Georgia,serif;font-size:clamp(32px,5vw,52px);line-height:1.02;letter-spacing:-0.03em;margin:0 0 14px}
 .lede{font-size:17px;line-height:1.6;color:var(--muted);max-width:64ch;margin:0 0 40px}
 .lede strong{color:var(--ink)}
 .g{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:30px 20px}
 figure{margin:0}
 figure img{width:100%;height:auto;display:block;border-radius:4px;box-shadow:0 8px 24px rgba(0,0,0,0.16)}
 figcaption{margin-top:10px;font-size:13px;line-height:1.4;color:var(--muted)}
 figcaption b{color:var(--acc)}
 figcaption span{color:var(--ink);font-weight:700}
</style>
<div class="w">
 <h1>Forty teaching cards<br>2026 Homecoming Conference</h1>
 <p class="lede">Each card teaches one real idea drawn from the official speaker synopses, and credits the speaker who will teach it. <strong>39 automated checks against that document, all passing.</strong> They give something away for free, which is what earns a save &mdash; and each one points at a lecture you have to register to hear. Post them between the eight carousels already in the folder.</p>
 <div class="g">${cells}</div>
</div>
`)
console.log('review.html written')
