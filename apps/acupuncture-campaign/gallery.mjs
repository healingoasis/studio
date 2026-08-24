// Builds a single self-contained review page. The script embeds the images,
// so the base64 never has to pass through anyone's hands.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'

const dir = new URL('./designs/', import.meta.url)
const files = readdirSync(dir).filter(f => /^a\d\d\.mjs$/.test(f)).sort()
const jpgs = readdirSync(new URL('./deliver/', import.meta.url)).filter(f => f.endsWith('.png')).sort()

const cards = []
for (const [i, f] of files.entries()) {
  const { meta } = await import(new URL(f, dir))
  const b64 = readFileSync(new URL(`./deliver/${jpgs[i]}`, import.meta.url)).toString('base64')
  cards.push(`
  <figure class="card">
    <img src="data:image/png;base64,${b64}" alt="${meta.angle}">
    <figcaption>
      <div class="n">${meta.id.slice(0, 2)}</div>
      <div>
        <div class="d">${meta.date}</div>
        <div class="a">${meta.angle}</div>
      </div>
    </figcaption>
  </figure>`)
}

writeFileSync(new URL('./review.html', import.meta.url), `<title>Acupuncture Campaign</title>
<style>
  :root { --bg:#faf6ef; --ink:#2a1512; --muted:#6b5550; --line:rgba(92,1,1,0.16); --maroon:#5c0101; --ember:#a87b2e; }
  :root:not([data-theme="light"]) { }
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) { --bg:#1b0f0d; --ink:#f5ecdf; --muted:#b49f98; --line:rgba(245,236,223,0.18); --maroon:#e8d9c8; --ember:#c9a24e; }
  }
  :root[data-theme="dark"] { --bg:#1b0f0d; --ink:#f5ecdf; --muted:#b49f98; --line:rgba(245,236,223,0.18); --maroon:#e8d9c8; --ember:#c9a24e; }
  body { margin:0; background:var(--bg); color:var(--ink);
         font-family:'Manrope',ui-sans-serif,system-ui,-apple-system,'Helvetica Neue',Arial,sans-serif; }
  .wrap { max-width:1180px; margin:0 auto; padding:56px 28px 80px; }
  header { border-bottom:2px solid var(--line); padding-bottom:26px; margin-bottom:40px; }
  h1 { font-family:Bitter,Georgia,serif; font-size:clamp(34px,5vw,54px); line-height:1.02;
       letter-spacing:-0.03em; margin:0 0 12px; }
  .sub { font-size:17px; line-height:1.6; color:var(--muted); max-width:62ch; margin:0; }
  .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:34px 26px; }
  .card { margin:0; }
  .card img { width:100%; height:auto; display:block; border-radius:4px;
              box-shadow:0 10px 30px rgba(0,0,0,0.18); background:#000; }
  figcaption { display:flex; gap:12px; align-items:baseline; margin-top:12px; }
  .n { font-family:Bitter,Georgia,serif; font-size:22px; font-weight:700; color:var(--ember); }
  .d { font-size:15px; font-weight:800; }
  .a { font-size:14px; color:var(--muted); margin-top:2px; }
  a { color:var(--ember); }
</style>
<div class="wrap">
  <header>
    <h1>Veterinary Acupuncture<br>Enrollment campaign</h1>
    <p class="sub">Twelve posts, 26 August to 14 September, closing two days before Module I opens. Every post is its own design &mdash; no layout repeats.
    Images are 1080&times;1350; the caption for each sits in the schedule file beside them in the feed folder.
    Every fact was checked against healingoasis.edu/acupuncture on 24 August 2026.</p>
  </header>
  <div class="grid">${cards.join('')}</div>
</div>
`)
console.log('review.html written')
