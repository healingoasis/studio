// 01 — THE OPENING. Photo bleeds off the right; type occupies a tall cream
// column on the left. Asymmetric, so it does not read like a poster.
import { C, P, mark } from '../shell.mjs'

export const meta = {
  id: '01-opening',
  date: 'Wednesday, August 26',
  angle: 'The program exists — announcement',
  bg: C.paper,
  caption: `We teach veterinary acupuncture.

The Veterinary Acupuncture Certificate Professional Enhancement Program — 132 hours of supervised training across five modules, canine and equine, with extensive hands-on clinical practicums and no required externships.

Module I begins September 16, 2026.

healingoasis.edu/acupuncture`,
}

export default `
  <div style="position:absolute; top:0; right:0; width:560px; height:1350px; overflow:hidden;">
    <img src="../img/hero-horse.jpg" alt="" style="width:560px; height:1350px; object-fit:cover; object-position:58% 50%; display:block;">
    <div style="position:absolute; inset:0; background:linear-gradient(90deg, rgba(250,246,239,0.96) 0%, rgba(250,246,239,0.10) 22%, rgba(0,0,0,0) 55%);"></div>
  </div>

  <div style="position:absolute; top:0; left:0; width:620px; height:1350px; padding:56px 0 0 60px;">
    ${mark('dark')}

    <div style="margin-top:110px; width:64px; height:4px; background:${C.brass};"></div>

    <div style="margin-top:34px; font-size:17px; font-weight:800; letter-spacing:0.30em; text-transform:uppercase; color:${C.brass};">Now teaching</div>

    <h1 style="margin-top:20px; font-family:'Bitter',Georgia,serif; font-weight:900; font-size:112px; line-height:0.86; letter-spacing:-0.045em; color:${C.maroon};">Veterinary<br>Acupuncture</h1>

    <p style="margin-top:28px; font-size:23px; line-height:1.45; font-weight:500; color:${C.ink}; max-width:500px;">A certificate program in the fundamentals as they are practiced in the United States &mdash; canine and equine, taught hands-on.</p>

    <div style="margin-top:44px; display:flex; flex-direction:column; gap:0; max-width:500px;">
      ${[[P.hours, 'hours of supervised training'],
         ['5', 'modules, September to February'],
         ['20', 'students maximum, per class']].map(([n, l], i) => `
        <div style="display:flex; align-items:baseline; gap:20px; padding:16px 0; ${i ? `border-top:1px solid rgba(92,1,1,0.16);` : ''}">
          <div style="font-family:'Bitter',Georgia,serif; font-size:46px; font-weight:700; color:${C.maroon}; line-height:1; width:96px; flex-shrink:0;">${n}</div>
          <div style="font-size:19px; font-weight:600; color:${C.muted};">${l}</div>
        </div>`).join('')}
    </div>

    <div style="position:absolute; left:60px; bottom:58px;">
      <div style="font-size:19px; font-weight:700; color:${C.muted};">Module I begins ${P.starts}</div>
      <div style="margin-top:10px; font-size:25px; font-weight:800; color:${C.maroon};">${P.url}</div>
    </div>
  </div>
`
