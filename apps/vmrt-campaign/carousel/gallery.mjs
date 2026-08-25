import { readFileSync, writeFileSync } from 'node:fs'
import { CAROUSELS } from './carousels.mjs'

const groups = CAROUSELS.map((c, ci) => {
  const slides = c.slides.map((_, i) => {
    const name = `${c.id}_s${String(i + 1).padStart(2, '0')}.jpg`
    const b64 = readFileSync(new URL(`./thumb/${name}`, import.meta.url)).toString('base64')
    return `<figure><img src="data:image/jpeg;base64,${b64}" alt=""><figcaption>${i + 1}</figcaption></figure>`
  }).join('')
  return `
  <section>
    <header class="ch">
      <div class="num">${String(ci + 1).padStart(2, '0')}</div>
      <div>
        <h2>${c.angle}</h2>
        <div class="meta">${c.date} &middot; ${c.slides.length} slides &middot; post in order as one carousel</div>
      </div>
    </header>
    <div class="strip">${slides}</div>
  </section>`
}).join('')

writeFileSync(new URL('./review.html', import.meta.url), `<title>VMRT Carousels</title>
<style>
  :root{--bg:#faf6ef;--ink:#2a1512;--muted:#6b5550;--line:rgba(92,1,1,0.16);--accent:#2f5d57}
  @media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#1a120e;--ink:#f5ecdf;--muted:#b49f98;--line:rgba(245,236,223,0.18);--accent:#7fb8ac}}
  :root[data-theme="dark"]{--bg:#1a120e;--ink:#f5ecdf;--muted:#b49f98;--line:rgba(245,236,223,0.18);--accent:#7fb8ac}
  body{margin:0;background:var(--bg);color:var(--ink);font-family:'Manrope',ui-sans-serif,system-ui,-apple-system,'Helvetica Neue',Arial,sans-serif}
  .wrap{max-width:1240px;margin:0 auto;padding:52px 24px 90px}
  h1{font-family:Bitter,Georgia,serif;font-size:clamp(32px,5vw,52px);line-height:1.02;letter-spacing:-0.03em;margin:0 0 14px}
  .lede{font-size:17px;line-height:1.6;color:var(--muted);max-width:64ch;margin:0}
  .lede strong{color:var(--ink)}
  section{margin-top:52px;padding-top:28px;border-top:2px solid var(--line)}
  .ch{display:flex;gap:18px;align-items:baseline;margin-bottom:18px}
  .num{font-family:Bitter,Georgia,serif;font-size:34px;font-weight:700;color:var(--accent);line-height:1}
  h2{font-family:Bitter,Georgia,serif;font-size:26px;font-weight:700;letter-spacing:-0.02em;margin:0}
  .meta{font-size:14px;color:var(--muted);margin-top:5px}
  .strip{display:grid;grid-template-columns:repeat(6,1fr);gap:12px}
  @media(max-width:900px){.strip{grid-template-columns:repeat(3,1fr)}}
  @media(max-width:520px){.strip{grid-template-columns:repeat(2,1fr)}}
  figure{margin:0;position:relative}
  figure img{width:100%;height:auto;display:block;border-radius:4px;box-shadow:0 6px 20px rgba(0,0,0,0.16);background:#000}
  figcaption{position:absolute;left:7px;top:7px;background:rgba(0,0,0,0.62);color:#fff;font-size:11px;font-weight:800;
             width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center}
</style>
<div class="wrap">
  <h1>Veterinary Massage &amp; Rehabilitation Therapy<br>Twelve carousels, 72 slides</h1>
  <p class="lede">Rebuilt as carousels rather than single posters. <strong>Carousels earn 3.4&times; the saves and 2.1&times; the shares of a static image</strong>, and Instagram re-serves one as soon as someone swipes to slide three &mdash; while static-image engagement fell 17% year over year. Six slides each, one idea per slide, nothing smaller than 34px so it reads on a phone. The curriculum slides come from the school&rsquo;s own outline document; everything else from healingoasis.edu.</p>
  ${groups}
</div>
`)
console.log('review.html written')
