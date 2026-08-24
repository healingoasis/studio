// 12 — LAST CALL. The closing post. Nearly black, one date, almost nothing
// else. After eleven busy posts, the quiet one is the one that lands.
import { C } from '../shell.mjs'

export const meta = {
  id: '12-last-call',
  date: 'Sunday, September 27',
  angle: 'Closing — the deadline',
  bg: '#1b0404',
  caption: `Registration closes October 12.

That is the last day, whichever way you were planning to attend. After it, the doors are shut until next year — no late list, no exceptions on the CE paperwork.

If you have been meaning to sort this out since August, this is the part where you do it.

October 23–25, Lombard, Illinois. Or live from anywhere.
https://healingoasis.edu/conference-2026/attend`,
}

export default `
  <div style="position:absolute; inset:0; background:
      radial-gradient(90% 60% at 50% 8%, rgba(92,1,1,0.55) 0%, rgba(27,4,4,0) 70%), #1b0404;"></div>

  <div style="position:absolute; top:0; left:0; right:0; height:420px; overflow:hidden; opacity:0.30;">
    <img src="../img/last.jpg" alt="" style="width:1080px; height:420px; object-fit:cover; object-position:50% 42%; display:block;">
    <div style="position:absolute; inset:0; background:linear-gradient(180deg, rgba(27,4,4,0.55) 0%, rgba(27,4,4,0.86) 62%, #1b0404 100%);"></div>
  </div>

  <div style="position:absolute; top:56px; left:0; right:0; text-align:center;">
    <div style="display:inline-flex; align-items:center; gap:14px;">
      <div style="width:46px; height:46px; border-radius:50%; background:${C.cream}; display:flex; align-items:center; justify-content:center;">
        <img src="../img/logo.png" alt="" style="width:39px; display:block;">
      </div>
      <div style="font-size:16px; font-weight:800; letter-spacing:0.26em; text-transform:uppercase; color:rgba(245,236,223,0.92);">2026 Homecoming Conference</div>
    </div>
    <div style="margin-top:14px; font-size:16px; font-weight:700; letter-spacing:0.20em; text-transform:uppercase; color:rgba(245,236,223,0.62);">October 23&ndash;25, 2026 &middot; Lombard, Illinois</div>
  </div>

  <div style="position:absolute; left:0; right:0; top:372px; text-align:center; padding:0 60px;">
    <div style="font-size:22px; font-weight:800; letter-spacing:0.40em; text-transform:uppercase; color:${C.ember};">Last call</div>

    <div style="margin-top:44px; font-family:'Bitter',Georgia,serif; font-size:150px; font-weight:900; line-height:0.86; letter-spacing:-0.045em; color:${C.cream};">October 12</div>
    <div style="margin:32px auto 0; width:220px; height:3px; background:rgba(245,236,223,0.28);"></div>
    <div style="margin-top:30px; font-size:32px; font-weight:700; color:rgba(245,236,223,0.86); line-height:1.35;">Registration closes.<br>In the room or on the stream.</div>

    <p style="margin:44px auto 0; max-width:720px; font-size:21px; line-height:1.55; font-weight:500; color:rgba(245,236,223,0.60);">After that the doors are shut until next year. If you have been meaning to sort this out since August, this is the part where you do it.</p>
  </div>

  <div style="position:absolute; left:60px; right:60px; bottom:200px; display:flex; justify-content:center; gap:0;">
    ${[['Oct 12', 'registration closes'], ['Oct 13', 'discounts expire'], ['Oct 23', 'doors open']].map(([d, l], i) => `
      <div style="flex:1; text-align:center; ${i ? 'border-left:1px solid rgba(245,236,223,0.20);' : ''}">
        <div style="font-family:'Bitter',Georgia,serif; font-size:40px; font-weight:700; color:#fff; line-height:1;">${d}</div>
        <div style="margin-top:8px; font-size:14px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; color:rgba(245,236,223,0.56);">${l}</div>
      </div>`).join('')}
  </div>

  <div style="position:absolute; left:0; right:0; bottom:0; height:104px; background:${C.cream}; padding:0 60px;
              display:flex; align-items:center; justify-content:center;">
    <div style="font-size:26px; font-weight:800; color:${C.maroon}; letter-spacing:-0.005em;">healingoasis.edu/conference-2026/attend</div>
  </div>
`
