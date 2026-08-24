// One template, twelve posts. Everything visual lives here so the campaign
// stays consistent; everything that changes post to post lives in posts.mjs.
import { writeFileSync, mkdirSync } from 'node:fs'
import { POSTS, CONF } from './posts.mjs'

const FONTS = 'https://fonts.googleapis.com/css2?family=Bitter:wght@400;700&family=Manrope:wght@400;500;600;700;800&display=swap'

const T = {
  dark: {
    panel: '#5c0101', ink: '#ffffff', body: 'rgba(245,236,223,0.86)',
    dim: 'rgba(245,236,223,0.72)', rule: 'rgba(245,236,223,0.30)',
    hair: 'rgba(245,236,223,0.22)', kicker: 'rgba(245,236,223,0.78)',
    cardBg: 'rgba(245,236,223,0.10)', cardLine: 'rgba(245,236,223,0.42)',
    barBg: '#f5ecdf', barInk: '#5c0101', barDim: '#7a3a3a', barRule: 'rgba(92,1,1,0.20)',
    fadeTo: '92,1,1',
  },
  light: {
    panel: '#f5ecdf', ink: '#2a1512', body: '#5f4a45',
    dim: '#6b5550', rule: 'rgba(92,1,1,0.22)',
    hair: 'rgba(92,1,1,0.18)', kicker: '#5c0101',
    cardBg: 'rgba(92,1,1,0.045)', cardLine: 'rgba(92,1,1,0.55)',
    barBg: '#5c0101', barInk: '#ffffff', barDim: 'rgba(245,236,223,0.82)', barRule: 'rgba(245,236,223,0.30)',
    fadeTo: '245,236,223',
  },
}

const block = (b, t) => {
  if (!b) return ''
  if (b.type === 'stats') return `
    <div style="margin: 26px 0 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px;">
      ${b.items.map(i => `<div style="display: flex; flex-direction: column; gap: 5px;">
        <div style="font-family: 'Bitter', Georgia, serif; font-size: 46px; font-weight: 700; line-height: 1; color: ${t.ink};">${i.value}</div>
        <div style="font-size: 17px; font-weight: 600; line-height: 1.35; color: ${t.dim};">${i.label}</div>
      </div>`).join('')}
    </div>`
  if (b.type === 'rows') return `
    <div style="margin: 26px 0 0; display: flex; flex-direction: column; gap: 0;">
      ${b.items.map((i, n) => `<div style="font-size: 21px; font-weight: 600; color: ${t.body}; padding: 14px 0; ${n ? `border-top: 1px solid ${t.hair};` : ''}">${i}</div>`).join('')}
    </div>`
  if (b.type === 'duo') return `
    <div style="margin: 26px 0 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px;">
      ${b.items.map(i => `<div style="background: ${t.cardBg}; border: 2px solid ${t.cardLine}; border-radius: 5px; padding: 20px 20px 22px; display: flex; flex-direction: column; gap: 12px;">
        <div style="font-family: 'Bitter', Georgia, serif; font-size: 29px; font-weight: 700; color: ${t.ink};">${i.title}</div>
        <div style="height: 1px; background: ${t.hair};"></div>
        <div style="display: flex; flex-direction: column; gap: 8px; font-size: 18px; line-height: 1.36; font-weight: 500; color: ${t.body};">
          ${i.lines.map(l => `<div>${l}</div>`).join('')}
        </div>
      </div>`).join('')}
    </div>`
  return ''
}

const page = (p) => {
  const t = T[p.theme]
  // posts with no detail block get a taller photo, so the panel never gapes
  const photoH = p.block ? 620 : 800
  const panelH = 1350 - photoH + 70
  return `<div style="width: 1080px; height: 1350px; position: relative; overflow: hidden; background: ${t.panel}; font-family: 'Manrope', 'Helvetica Neue', Arial, sans-serif; color: ${t.ink};">

  <div style="position: relative; width: 1080px; height: ${photoH}px; overflow: hidden;">
    <img src="../img/${p.image}" alt="" style="width: 1080px; height: ${photoH}px; object-fit: cover; display: block;">
    <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(20,0,0,0.78) 0%, rgba(20,0,0,0.46) 12%, rgba(20,0,0,0.12) 24%, rgba(${t.fadeTo},0.00) 52%, rgba(${t.fadeTo},0.60) 82%, rgba(${t.fadeTo},0.96) 95%, ${t.panel} 100%);"></div>

    <div style="position: absolute; top: 40px; left: 60px; right: 60px; display: flex; align-items: center; justify-content: space-between; gap: 20px;">
      <div style="display: flex; align-items: center; gap: 16px;">
        <div style="width: 70px; height: 70px; border-radius: 50%; background: #f5ecdf; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
          <img src="../img/logo.png" alt="Healing Oasis Wellness Center" style="width: 59px; height: auto; display: block;">
        </div>
        <div style="display: flex; flex-direction: column; gap: 3px;">
          <div style="font-size: 19px; font-weight: 800; letter-spacing: 0.19em; text-transform: uppercase; color: #ffffff;">Healing Oasis Wellness Center</div>
          <div style="font-size: 16px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.74);">The 2026 Conference</div>
        </div>
      </div>
      <div style="text-align: right; font-size: 16px; font-weight: 700; letter-spacing: 0.13em; text-transform: uppercase; line-height: 1.5; color: rgba(255,255,255,0.86); white-space: nowrap;">${CONF.dates}<br>${CONF.place}</div>
    </div>
  </div>

  <div style="position: absolute; left: 0; right: 0; bottom: 0; height: ${panelH}px; padding: 0 60px 46px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: flex-end;">

    <div style="font-size: 19px; font-weight: 800; letter-spacing: 0.20em; text-transform: uppercase; color: ${t.kicker};">${p.kicker}</div>

    <h1 style="margin: 16px 0 0; font-family: 'Bitter', Georgia, serif; font-weight: 700; font-size: ${p.size}px; line-height: 1.00; letter-spacing: -0.018em; color: ${t.ink}; text-wrap: pretty;">${p.headline}</h1>

    <p style="margin: 18px 0 0; font-size: 21px; line-height: 1.48; font-weight: 500; color: ${t.body}; max-width: 940px; text-wrap: pretty;">${p.body}</p>
${block(p.block, t)}

    <div style="margin: 32px 0 0; background: ${t.barBg}; border-radius: 4px; padding: 20px 26px; display: flex; align-items: center; justify-content: space-between; gap: 20px;">
      <div style="display: flex; flex-direction: column; gap: 3px;">
        <div style="font-size: 23px; font-weight: 800; color: ${t.barInk};">Register at</div>
        <div style="font-size: 19px; font-weight: 600; color: ${t.barDim};">${CONF.url}</div>
      </div>
      <div style="text-align: right; border-left: 2px solid ${t.barRule}; padding-left: 22px; font-size: 18px; font-weight: 700; line-height: 1.4; color: ${t.barInk}; white-space: nowrap;">${CONF.closes.replace(' Oct 12', '<br>Oct 12')}</div>
    </div>

  </div>
</div>`
}

mkdirSync(new URL('./out/', import.meta.url), { recursive: true })
for (const p of POSTS) {
  writeFileSync(new URL(`./out/${p.id}.html`, import.meta.url), `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
<style>
  body { margin: 0; background: #fff; font-family: 'Manrope', 'Helvetica Neue', Arial, sans-serif; }
  a { color: #5c0101; } a:hover { color: #7a3a3a; }
</style>
</head>
<body>
${page(p)}
</body>
</html>
`)
  console.log(`${p.id}  ${p.theme}  ${p.date}`)
}
