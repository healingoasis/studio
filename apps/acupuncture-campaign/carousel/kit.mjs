// The carousel kit.
//
// Sizing comes from research, not taste. A 1080px-wide graphic renders about
// 420px wide in a phone feed — a scale factor of roughly 0.39. Guidance is that
// key information should read at 32pt+ on mobile, so nothing here is allowed
// below 42px, and headlines start at 96px. The previous single-poster set used
// 17–21px body copy, which rendered at about 7px on a phone.
//
// Structure comes from research too: 5–8 slides, a hook slide carrying a
// specific number and a visible promise, a swipe cue, and one idea per slide.
// Detail lives in the caption, never in the picture.

export const FONTS = 'https://fonts.googleapis.com/css2?family=Bitter:ital,wght@0,400;0,700;0,900;1,700&family=Manrope:wght@500;600;700;800&display=swap'

export const T = {
  hero:    170,  // hook-slide numerals
  h1:      110,  // slide headline
  h2:       78,  // secondary headline
  lead:     54,  // the one sentence on a content slide
  body:     46,  // supporting line — the floor for anything that must be read
  label:    34,  // eyebrows and kickers only, never a sentence
}

export const C = {
  maroon: '#5c0101',
  deep:   '#2b0606',
  night:  '#180707',
  ink:    '#2a1512',
  cream:  '#f5ecdf',
  paper:  '#faf6ef',
  brass:  '#a87b2e',
  muted:  '#6b5550',
}

export const W = 1080, H = 1350

export const shell = (body, bg) => `<!doctype html>
<html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
<style>
  html,body{margin:0;padding:0;background:${bg}}
  *{box-sizing:border-box}
  .s{width:${W}px;height:${H}px;position:relative;overflow:hidden;background:${bg};
     font-family:'Manrope','Helvetica Neue',Arial,sans-serif}
  h1,h2,p{margin:0}
</style></head><body><div class="s">
${body}
</div></body></html>
`

// The small persistent furniture. Deliberately tiny in the frame: it is
// identification, not communication, and it must never compete with the message.
export const badge = (tone = 'light') => `
  <div style="display:flex;align-items:center;gap:16px">
    <div style="width:56px;height:56px;border-radius:50%;background:${C.cream};${tone === 'light' ? '' : `border:3px solid ${C.maroon};`}display:flex;align-items:center;justify-content:center;flex-shrink:0">
      <img src="../../img/logo.png" alt="" style="width:47px;display:block">
    </div>
    <div style="font-size:${T.label}px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:${tone === 'light' ? 'rgba(255,255,255,0.92)' : C.maroon};line-height:1.4">
      Healing Oasis<br>Wellness Center
    </div>
  </div>`

// A swipe cue. The research is explicit that carousels need one on the hook
// slide; the algorithm rewards the swipe to slide three more than anything else.
export const swipe = (tone = 'light') => {
  const col = tone === 'light' ? 'rgba(255,255,255,0.86)' : C.maroon
  return `
  <div style="display:flex;align-items:center;gap:14px">
    <div style="font-size:${T.label}px;font-weight:800;letter-spacing:0.16em;text-transform:uppercase;color:${col}">Swipe</div>
    <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="${col}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 12h14"></path><path d="M12 5l7 7-7 7"></path>
    </svg>
  </div>`
}

// Slide counter, so a viewer knows there is more and how much.
export const pips = (n, total, tone = 'light') => `
  <div style="display:flex;gap:9px;align-items:center">
    ${Array.from({ length: total }, (_, i) => `<div style="width:${i === n ? 30 : 11}px;height:11px;border-radius:6px;background:${i === n ? (tone === 'light' ? '#fff' : C.maroon) : (tone === 'light' ? 'rgba(255,255,255,0.34)' : 'rgba(92,1,1,0.26)')}"></div>`).join('')}
  </div>`
