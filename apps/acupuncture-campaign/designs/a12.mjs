// 12 — THE DATE. Closing post. One photograph, one date, one instruction.
import { C, P } from '../shell.mjs'

export const meta = {
  id: '12-september-sixteen',
  date: 'Monday, September 14',
  angle: 'Closing — Module I begins',
  bg: C.night,
  caption: `Module I begins September 16, 2026.

Five days, Wednesday to Sunday, Virtual-Live from wherever you are. Then four more modules through to February — two of them face-to-face in Sturtevant, Wisconsin.

132 hours. Canine and equine. Twenty students. $200 holds a seat.

If you have been circling this one for a while, the circling is nearly over.

healingoasis.edu/acupuncture`,
}

export default `
  <img src="../img/needle-band.jpg" alt="" style="position:absolute; top:0; left:0; width:1080px; height:1350px; object-fit:cover; object-position:50% 40%;">
  <div style="position:absolute; inset:0; background:
      linear-gradient(180deg, rgba(26,8,8,0.80) 0%, rgba(26,8,8,0.40) 30%, rgba(26,8,8,0.78) 62%, ${C.night} 92%);"></div>

  <div style="position:absolute; top:56px; left:0; right:0; text-align:center;">
    <div style="display:inline-flex; align-items:center; gap:14px;">
      <div style="width:46px; height:46px; border-radius:50%; background:${C.cream}; display:flex; align-items:center; justify-content:center;">
        <img src="../img/logo.png" alt="" style="width:39px; display:block;">
      </div>
      <div style="font-size:15px; font-weight:800; letter-spacing:0.28em; text-transform:uppercase; color:rgba(245,236,223,0.92);">Healing Oasis Wellness Center</div>
    </div>
    <div style="margin-top:14px; font-size:15px; font-weight:700; letter-spacing:0.22em; text-transform:uppercase; color:rgba(245,236,223,0.60);">Veterinary Acupuncture Certificate Program</div>
  </div>

  <div style="position:absolute; left:0; right:0; top:430px; text-align:center; padding:0 64px;">
    <div style="font-size:20px; font-weight:800; letter-spacing:0.38em; text-transform:uppercase; color:${C.brass};">Module I begins</div>
    <div style="margin-top:36px; font-family:'Bitter',Georgia,serif; font-size:136px; font-weight:900; line-height:0.86; letter-spacing:-0.048em; color:${C.cream};">September 16</div>
    <div style="margin:34px auto 0; width:200px; height:3px; background:rgba(168,123,46,0.75);"></div>
    <p style="margin:34px auto 0; max-width:760px; font-size:24px; line-height:1.5; font-weight:500; color:rgba(245,236,223,0.80);">Five days, Wednesday to Sunday, Virtual-Live from wherever you are. Then four more modules through to February.</p>
  </div>

  <div style="position:absolute; left:64px; right:64px; bottom:200px; display:flex;">
    ${[['132', 'hours'], ['5', 'modules'], ['20', 'seats'], [P.deposit, 'holds one']].map(([a, b], i) => `
      <div style="flex:1; text-align:center; ${i ? 'border-left:1px solid rgba(245,236,223,0.20);' : ''}">
        <div style="font-family:'Bitter',Georgia,serif; font-size:46px; font-weight:700; color:#fff; line-height:1;">${a}</div>
        <div style="margin-top:8px; font-size:14px; font-weight:700; letter-spacing:0.16em; text-transform:uppercase; color:rgba(245,236,223,0.58);">${b}</div>
      </div>`).join('')}
  </div>

  <div style="position:absolute; left:0; right:0; bottom:0; height:112px; background:${C.cream}; padding:0 64px;
              display:flex; align-items:center; justify-content:center;">
    <div style="font-size:27px; font-weight:800; color:${C.maroon}; letter-spacing:-0.005em;">${P.url}</div>
  </div>
`
