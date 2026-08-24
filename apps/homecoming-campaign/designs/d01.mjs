// 01 — THE INVITATION. Cinematic one-word poster. Photo carries everything;
// type stays out of its way until the bottom third.
import { C } from '../shell.mjs'

export const meta = {
  id: '01-invitation',
  date: 'Tuesday, August 25',
  angle: 'Opening — registration is live',
  bg: C.deep,
  caption: `Homecoming.

October 23–25 in Lombard, Illinois. Three days of rehabilitation, sports medicine and manual therapy — and three days among the only people who understand what your Tuesday looks like.

Registration is open now: https://healingoasis.edu/conference-2026/attend`,
}

export default `
  <img src="../img/inv.jpg" alt="" style="position:absolute; inset:0; width:1080px; height:1350px; object-fit:cover;">
  <div style="position:absolute; inset:0; background:
      radial-gradient(120% 78% at 50% 40%, rgba(20,3,3,0.00) 0%, rgba(20,3,3,0.34) 58%, rgba(20,3,3,0.80) 100%),
      linear-gradient(180deg, rgba(20,3,3,0.70) 0%, rgba(20,3,3,0.04) 22%, rgba(20,3,3,0.08) 48%, rgba(20,3,3,0.80) 62%, ${C.deep} 82%);"></div>

  <div style="position:absolute; top:52px; left:0; right:0; display:flex; justify-content:center;">
    <div style="display:flex; align-items:center; gap:14px;">
      <div style="width:44px; height:44px; border-radius:50%; background:${C.cream}; display:flex; align-items:center; justify-content:center;">
        <img src="../img/logo.png" alt="" style="width:37px; display:block;">
      </div>
      <div style="font-size:17px; font-weight:800; letter-spacing:0.30em; text-transform:uppercase; color:rgba(245,236,223,0.92);">Healing Oasis Wellness Center</div>
    </div>
  </div>

  <div style="position:absolute; left:0; right:0; bottom:0; padding:0 70px 66px; text-align:center;">
    <div style="font-size:20px; font-weight:700; letter-spacing:0.42em; text-transform:uppercase; color:${C.ember};">The 2026</div>
    <h1 style="font-family:'Bitter',Georgia,serif; font-weight:900; font-size:150px; line-height:0.86; letter-spacing:-0.035em; color:#fff; margin-top:10px;">Homecoming<br>Conference</h1>
    <div style="margin:30px auto 0; width:180px; height:3px; background:${C.ember};"></div>
    <div style="margin-top:28px; font-family:'Bitter',Georgia,serif; font-size:40px; font-weight:700; color:#fff; letter-spacing:-0.01em;">October 23&ndash;25, 2026</div>
    <div style="margin-top:10px; font-size:21px; font-weight:600; letter-spacing:0.16em; text-transform:uppercase; color:rgba(245,236,223,0.80);">Lombard, Illinois &middot; or live from anywhere</div>
    <div style="margin-top:38px; display:inline-block; border:2px solid rgba(245,236,223,0.55); border-radius:3px; padding:15px 34px; font-size:20px; font-weight:800; letter-spacing:0.08em; color:#fff;">healingoasis.edu/conference-2026/attend</div>
  </div>
`
