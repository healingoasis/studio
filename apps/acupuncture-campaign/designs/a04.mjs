// 04 — CANINE AND EQUINE. A hard diagonal, because the program is genuinely
// two practices taught as one and a straight split would say the wrong thing.
import { C, P, mark } from '../shell.mjs'

export const meta = {
  id: '04-both-species',
  date: 'Tuesday, September 1',
  angle: 'Canine and equine, not one or the other',
  bg: C.night,
  caption: `Canine and equine. Both, in the same program.

Not a small-animal course with a horse chapter bolted on. The point sits differently on a Doberman than on a Warmblood, and you learn both from people who work on both.

132 hours, five modules, extensive hands-on clinical practicums. Module I begins September 16.

healingoasis.edu/acupuncture`,
}

export default `
  <div style="position:absolute; inset:0;">
    <img src="../img/dog-col.jpg" alt="" style="position:absolute; top:0; left:0; width:1080px; height:1350px; object-fit:cover; object-position:44% 34%;">
    <div style="position:absolute; inset:0; background:linear-gradient(180deg, rgba(26,8,8,0.62) 0%, rgba(26,8,8,0.20) 34%, rgba(26,8,8,0.70) 100%);"></div>
  </div>

  <div style="position:absolute; inset:0; clip-path:polygon(0 100%, 100% 0, 100% 100%);">
    <img src="../img/horse-col.jpg" alt="" style="position:absolute; top:0; left:0; width:1080px; height:1350px; object-fit:cover; object-position:56% 46%;">
    <div style="position:absolute; inset:0; background:linear-gradient(180deg, rgba(26,8,8,0.30) 0%, rgba(26,8,8,0.66) 70%, rgba(26,8,8,0.86) 100%);"></div>
  </div>

  <div style="position:absolute; inset:0; clip-path:polygon(0 100%, 100% 0, 100% 0.6%, 0 100.6%); background:${C.brass};"></div>

  <div style="position:absolute; top:52px; left:56px; right:56px;">${mark('light')}</div>

  <div style="position:absolute; top:250px; left:56px; width:560px;">
    <div style="font-size:17px; font-weight:800; letter-spacing:0.30em; text-transform:uppercase; color:${C.brass};">Species</div>
    <h1 style="margin-top:16px; font-family:'Bitter',Georgia,serif; font-weight:900; font-size:132px; line-height:0.82; letter-spacing:-0.05em; color:#fff;">Canine<br><span style="color:${C.brass};">&amp;</span><br>Equine</h1>
  </div>

  <div style="position:absolute; right:56px; bottom:264px; width:520px; text-align:right;">
    <p style="font-size:24px; line-height:1.46; font-weight:600; color:#fff;">Not a small-animal course with a horse chapter bolted on. The point sits differently on a Doberman than on a Warmblood.</p>
    <p style="margin-top:18px; font-size:19px; line-height:1.5; font-weight:500; color:rgba(245,236,223,0.72);">You learn both, from people who work on both.</p>
  </div>

  <div style="position:absolute; left:56px; right:56px; bottom:130px; display:flex; gap:14px;">
    ${[[P.hours + ' hours'], ['5 modules'], ['20 students max'], ['No externships']].map(([t]) => `
      <div style="flex:1; border:2px solid rgba(245,236,223,0.34); border-radius:3px; padding:14px 0; text-align:center;
                  font-size:16px; font-weight:800; letter-spacing:0.06em; color:#fff;">${t}</div>`).join('')}
  </div>

  <div style="position:absolute; left:0; right:0; bottom:0; height:96px; background:${C.cream}; padding:0 56px;
              display:flex; align-items:center; justify-content:space-between;">
    <div style="font-size:23px; font-weight:800; color:${C.maroon};">${P.url}</div>
    <div style="font-size:15px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:#7a3a3a;">Begins Sept 16, 2026</div>
  </div>
`
