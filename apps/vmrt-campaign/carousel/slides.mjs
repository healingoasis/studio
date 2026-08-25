// Slide renderers, shared by both campaigns. healingoasis.edu — VMRT Program and Fall 2026 and Spring 2027 — both open are replaced
// when this is emitted into each campaign folder.
//
// Every slide type can take a photograph. When one is present the slide goes
// full-bleed behind a veil and the type flips to light — so a photo is never a
// special layout, just a property. Feeds are visual; a wall of typographic
// slides is the mistake this fixes.
import { C, T, W, H, badge, swipe, pips } from './kit.mjs'

const furniture = (th, i, total, tone) => `
  <div style="position:absolute;top:52px;left:56px;right:56px;display:flex;align-items:center;justify-content:space-between">
    ${badge(tone)}
    ${pips(i, total, tone)}
  </div>`

const foot = (tone, extra = '') => `
  <div style="position:absolute;left:56px;right:56px;bottom:46px;display:flex;align-items:center;justify-content:space-between;gap:24px">
    <div style="font-size:${T.label}px;font-weight:800;color:${tone === 'light' ? 'rgba(255,255,255,0.86)' : C.maroon};letter-spacing:0.01em">healingoasis.edu — VMRT Program</div>
    ${extra}
  </div>`

const photoLayer = (img, pos, veil) => `
  <img src="../../img/${img}" alt="" style="position:absolute;inset:0;width:${W}px;height:${H}px;object-fit:cover;object-position:${pos || '50% 42%'}">
  <div style="position:absolute;inset:0;background:${veil}"></div>`

export const render = (sl, th, i, total) => {
  // A photograph overrides the skin's colours: on an image, type is always light.
  const onPhoto = !!sl.img && sl.kind !== 'person' && sl.kind !== 'quad'
  const tone  = onPhoto ? 'light' : th.tone
  const inkC  = onPhoto ? '#ffffff' : th.ink
  const subC  = onPhoto ? 'rgba(255,255,255,0.88)' : th.sub
  const acc   = onPhoto ? (th.accentOn || '#ffd9a0') : th.accent
  const ruleC = onPhoto ? 'rgba(255,255,255,0.30)' : th.rule
  // Text-heavy slides need a heavier, flatter scrim — a gradient tuned for a
  // headline will not hold a price list against a bright exhibit table.
  // Two scrims, both tuned so the type is readable over ANY photograph rather
  // than over a lucky one. HEAVY for list-like slides, MEDIUM for the rest.
  const HEAVY  = 'linear-gradient(180deg,rgba(16,5,5,0.82) 0%,rgba(16,5,5,0.74) 30%,rgba(16,5,5,0.78) 70%,rgba(16,5,5,0.88) 100%)'
  const MEDIUM = 'linear-gradient(180deg,rgba(16,5,5,0.72) 0%,rgba(16,5,5,0.46) 16%,rgba(16,5,5,0.68) 40%,rgba(16,5,5,0.72) 72%,rgba(16,5,5,0.88) 100%)'
  const dense = sl.kind === 'steps' || sl.kind === 'quote'
  const back  = onPhoto ? photoLayer(sl.img, sl.pos, sl.veil || (dense ? HEAVY : MEDIUM)) : ''
  const top   = furniture(th, i, total, tone)

  if (sl.kind === 'hook') return `
    ${back}${top}
    <div style="position:absolute;left:56px;right:56px;top:50%;transform:translateY(-50%)">
      ${sl.num ? `<div style="font-family:'Bitter',Georgia,serif;font-size:${T.hero}px;font-weight:900;line-height:0.82;letter-spacing:-0.05em;color:${acc}">${sl.num}</div>` : ''}
      <h1 style="margin-top:${sl.num ? 22 : 0}px;font-family:'Bitter',Georgia,serif;font-weight:900;font-size:${sl.size || T.h1}px;line-height:0.92;letter-spacing:-0.04em;color:${inkC}">${sl.big}</h1>
      ${sl.sub ? `<p style="margin-top:30px;font-size:${T.lead}px;line-height:1.28;font-weight:600;color:${subC};max-width:900px">${sl.sub}</p>` : ''}
    </div>
    ${foot(tone, swipe(tone))}`

  if (sl.kind === 'photo') return `
    ${photoLayer(sl.img, sl.pos, sl.veil || th.veil)}${furniture(th, i, total, 'light')}
    <div style="position:absolute;left:56px;right:56px;bottom:150px">
      ${sl.kicker ? `<div style="font-size:${T.label}px;font-weight:800;letter-spacing:0.22em;text-transform:uppercase;color:${th.accentOn || '#ffd9a0'};margin-bottom:20px">${sl.kicker}</div>` : ''}
      <h2 style="font-family:'Bitter',Georgia,serif;font-weight:700;font-size:${sl.size || T.h2}px;line-height:0.98;letter-spacing:-0.03em;color:#fff">${sl.big}</h2>
      ${sl.sub ? `<p style="margin-top:24px;font-size:${T.body}px;line-height:1.32;font-weight:600;color:rgba(255,255,255,0.88);max-width:880px">${sl.sub}</p>` : ''}
    </div>
    ${foot('light')}`

  if (sl.kind === 'stat') return `
    ${back}${top}
    <div style="position:absolute;left:56px;right:56px;top:50%;transform:translateY(-50%)">
      <div style="display:flex;align-items:baseline;gap:26px;flex-wrap:wrap">
        <div style="font-family:'Bitter',Georgia,serif;font-size:${sl.size || 260}px;font-weight:900;line-height:0.80;letter-spacing:-0.055em;color:${acc}">${sl.num}</div>
        ${sl.unit ? `<div style="font-size:${T.h2}px;font-weight:800;letter-spacing:-0.01em;color:${inkC}">${sl.unit}</div>` : ''}
      </div>
      <p style="margin-top:36px;font-size:${T.lead}px;line-height:1.28;font-weight:600;color:${subC};max-width:900px">${sl.sub}</p>
    </div>
    ${foot(tone)}`

  if (sl.kind === 'lead') return `
    ${back}${top}
    <div style="position:absolute;left:56px;right:56px;top:50%;transform:translateY(-50%)">
      ${sl.kicker ? `<div style="font-size:${T.label}px;font-weight:800;letter-spacing:0.22em;text-transform:uppercase;color:${acc}">${sl.kicker}</div>` : ''}
      <h2 style="margin-top:24px;font-family:'Bitter',Georgia,serif;font-weight:700;font-size:${sl.size || T.h1}px;line-height:0.94;letter-spacing:-0.035em;color:${inkC}">${sl.big}</h2>
      ${sl.sub ? `<p style="margin-top:32px;font-size:${T.lead}px;line-height:1.3;font-weight:600;color:${subC};max-width:920px">${sl.sub}</p>` : ''}
    </div>
    ${foot(tone)}`

  if (sl.kind === 'person') return `
    ${furniture(th, i, total, th.tone)}
    <div style="position:absolute;left:56px;right:56px;top:210px">
      <img src="../../img/${sl.img}" alt="" style="width:100%;height:640px;object-fit:cover;object-position:${sl.pos || '50% 26%'};border-radius:6px;display:block">
    </div>
    <div style="position:absolute;left:56px;right:56px;top:900px">
      <div style="font-family:'Bitter',Georgia,serif;font-size:${T.h2}px;font-weight:700;line-height:1;letter-spacing:-0.03em;color:${th.ink}">${sl.name}</div>
      <div style="margin-top:16px;font-size:${T.body - 4}px;font-weight:800;color:${th.accent};line-height:1.25">${sl.cred}</div>
      ${sl.line ? `<p style="margin-top:18px;font-size:${T.body}px;line-height:1.3;font-weight:600;color:${th.sub}">${sl.line}</p>` : ''}
    </div>
    ${foot(th.tone)}`

  if (sl.kind === 'steps') return `
    ${back}${top}
    <div style="position:absolute;left:56px;right:56px;top:50%;transform:translateY(-50%)">
      ${sl.kicker ? `<div style="font-size:${T.label}px;font-weight:800;letter-spacing:0.22em;text-transform:uppercase;color:${acc};margin-bottom:40px">${sl.kicker}</div>` : ''}
      ${sl.items.map((it, k) => {
        const wide = /[a-z$]/.test(it.n) || it.n.length > 3
        return `
        <div style="display:flex;gap:28px;align-items:flex-start;padding:26px 0;${k ? `border-top:2px solid ${ruleC};` : ''}">
          <div style="font-family:'Bitter',Georgia,serif;font-size:${wide ? T.body : T.h2 - 6}px;font-weight:900;line-height:1.05;color:${acc};width:${wide ? 200 : 110}px;flex-shrink:0;padding-top:${wide ? 8 : 0}px">${it.n}</div>
          <div>
            <div style="font-size:${T.lead}px;font-weight:800;line-height:1.12;color:${inkC};letter-spacing:-0.015em">${it.t}</div>
            ${it.d ? `<div style="margin-top:12px;font-size:${T.body - 2}px;font-weight:600;line-height:1.28;color:${subC}">${it.d}</div>` : ''}
          </div>
        </div>`
      }).join('')}
    </div>
    ${foot(tone)}`

  if (sl.kind === 'quad') return `
    ${furniture(th, i, total, th.tone)}
    <div style="position:absolute;left:56px;right:56px;top:186px">
      ${sl.kicker ? `<div style="font-size:${T.label}px;font-weight:800;letter-spacing:0.22em;text-transform:uppercase;color:${th.accent};margin-bottom:30px">${sl.kicker}</div>` : ''}
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:26px 24px">
        ${sl.people.map(([f, name, note]) => `
          <div>
            <div style="width:100%;height:326px;overflow:hidden;border-radius:5px;background:${C.deep}">
              ${false
                ? `<div style="width:100%;height:100%;background:${C.maroon};display:flex;align-items:center;justify-content:center"><span style="font-family:'Bitter',Georgia,serif;font-size:120px;font-weight:700;color:rgba(245,236,223,0.92)">AP</span></div>`
                : `<img src="../../img/fac/${f}.jpg" alt="" style="width:100%;height:100%;object-fit:cover;object-position:50% 26%;display:block">`}
            </div>
            <div style="margin-top:14px;font-size:${T.body - 2}px;font-weight:800;line-height:1.1;color:${th.ink};letter-spacing:-0.012em">${name}</div>
            <div style="margin-top:6px;font-size:${T.label}px;font-weight:600;line-height:1.2;color:${th.sub}">${note}</div>
          </div>`).join('')}
      </div>
    </div>
    ${foot(th.tone)}`

  if (sl.kind === 'quote') return `
    ${back}${top}
    <div style="position:absolute;left:56px;right:56px;top:50%;transform:translateY(-50%)">
      <div style="font-family:'Bitter',Georgia,serif;font-size:200px;line-height:0.42;height:92px;color:${acc};opacity:${onPhoto ? 0.55 : 0.30}">&ldquo;</div>
      <h2 style="margin-top:8px;font-family:'Bitter',Georgia,serif;font-style:italic;font-weight:700;font-size:${sl.size || 74}px;line-height:1.08;letter-spacing:-0.025em;color:${inkC}">${sl.text}</h2>
      <div style="margin-top:52px;display:flex;align-items:center;gap:24px">
        <img src="../../img/${sl.face}" alt="" style="width:120px;height:120px;border-radius:50%;object-fit:cover;object-position:50% 26%;border:4px solid ${acc};flex-shrink:0">
        <div>
          <div style="font-size:${T.lead - 4}px;font-weight:800;color:${inkC};letter-spacing:-0.015em;line-height:1.1">${sl.who}</div>
          <div style="margin-top:8px;font-size:${T.body - 4}px;font-weight:700;color:${acc};line-height:1.2">${sl.cred}</div>
        </div>
      </div>
    </div>
    ${foot(tone)}`

  if (sl.kind === 'cta') return `
    ${back}${top}
    <div style="position:absolute;left:56px;right:56px;top:50%;transform:translateY(-50%)">
      <div style="font-size:${T.label}px;font-weight:800;letter-spacing:0.24em;text-transform:uppercase;color:${acc}">${sl.kicker || 'Enroll'}</div>
      <h2 style="margin-top:26px;font-family:'Bitter',Georgia,serif;font-weight:900;font-size:${sl.size || T.h1}px;line-height:0.92;letter-spacing:-0.04em;color:${inkC}">${sl.big}</h2>
      ${sl.sub ? `<p style="margin-top:30px;font-size:${T.lead}px;line-height:1.28;font-weight:600;color:${subC};max-width:900px">${sl.sub}</p>` : ''}
      <div style="margin-top:48px;display:inline-block;background:${onPhoto ? '#ffffff' : th.accent};border-radius:6px;padding:26px 40px;font-size:${T.body}px;font-weight:800;color:${onPhoto ? C.maroon : (th.ctaInk || '#fff')}">healingoasis.edu — VMRT Program</div>
    </div>
    <div style="position:absolute;left:56px;right:56px;bottom:46px;font-size:${T.label}px;font-weight:800;letter-spacing:0.10em;text-transform:uppercase;color:${subC}">${sl.foot || 'Fall 2026 and Spring 2027 — both open'}</div>`

  return ''
}
