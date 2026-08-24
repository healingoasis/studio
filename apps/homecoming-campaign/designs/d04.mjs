// 04 — THE NUMBER. One figure at absurd scale, cropped by the frame.
// Reads at thumbnail size, which is where the scroll actually happens.
import { C } from '../shell.mjs'

export const meta = {
  id: '04-twenty-hours',
  date: 'Thursday, September 3',
  angle: 'CE hours — the practical case',
  bg: C.maroon,
  caption: `Twenty.

That is the maximum CE contact hours across the three days — approved through AAVSB-RACE (ID #20-139-5976), the American Holistic Veterinary Medical Association and the College of Animal Chiropractors, with reciprocity through the IVCA. Minnesota chiropractic licences carry separate approvals for the in-person and virtual-live formats.

The live stream earns the same credit as the seat in the room.

October 23–25, Lombard, Illinois.
https://healingoasis.edu/conference-2026/attend`,
}

export default `
  <div style="position:absolute; top:0; left:0; right:0; height:330px; overflow:hidden;">
    <img src="../img/num.jpg" alt="" style="width:1080px; height:330px; object-fit:cover; object-position:50% 34%; display:block; filter:saturate(0.9);">
    <div style="position:absolute; inset:0; background:linear-gradient(180deg, rgba(43,6,6,0.62) 0%, rgba(43,6,6,0.18) 42%, rgba(92,1,1,0.86) 88%, ${C.maroon} 100%);"></div>
    <div style="position:absolute; top:44px; left:56px; right:56px; display:flex; align-items:center; justify-content:space-between;">
      <div style="display:flex; align-items:center; gap:14px;">
        <div style="width:48px; height:48px; border-radius:50%; background:${C.cream}; display:flex; align-items:center; justify-content:center;">
          <img src="../img/logo.png" alt="" style="width:40px; display:block;">
        </div>
        <div style="font-size:16px; font-weight:800; letter-spacing:0.22em; text-transform:uppercase; color:#fff;">2026 Homecoming Conference</div>
      </div>
      <div style="font-size:14px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; color:rgba(245,236,223,0.84);">Oct 23&ndash;25 &middot; Lombard, IL</div>
    </div>
  </div>

  <div style="position:absolute; top:300px; left:0; right:0; bottom:92px; padding:0 56px 26px;
              display:flex; flex-direction:column; align-items:center; justify-content:space-between;">

    <div style="text-align:center; margin-top:-26px;">
      <div style="font-family:'Bitter',Georgia,serif; font-weight:900; font-size:520px; line-height:0.80; letter-spacing:-0.06em; color:${C.cream};">20</div>
      <div style="margin-top:6px; font-size:32px; font-weight:800; letter-spacing:0.30em; text-transform:uppercase; color:${C.ember};">CE contact hours</div>
    </div>

    <p style="max-width:800px; text-align:center; font-size:24px; line-height:1.5; font-weight:500; color:rgba(245,236,223,0.90);">The maximum across three days &mdash; and the live stream earns exactly the same credit as the seat in the room.</p>

    <div style="width:100%; display:grid; grid-template-columns:repeat(3, minmax(0,1fr)); gap:14px;">
      ${[
        ['AAVSB-RACE', 'Approved &middot; ID #20-139-5976'],
        ['AHVMA', 'Approved &middot; max 20 hours'],
        ['Coll. of Animal Chiro.', 'Approved &middot; max 20 hours'],
      ].map(([a, b]) => `<div style="border:2px solid rgba(245,236,223,0.34); border-radius:4px; padding:16px 18px;">
        <div style="font-size:18px; font-weight:800; color:#fff; letter-spacing:-0.005em;">${a}</div>
        <div style="font-size:14px; font-weight:600; color:rgba(245,236,223,0.74); margin-top:4px;">${b}</div>
      </div>`).join('')}
    </div>
  </div>

  <div style="position:absolute; left:0; right:0; bottom:0; height:92px; background:${C.cream}; padding:0 56px;
              display:flex; align-items:center; justify-content:space-between;">
    <div style="font-size:22px; font-weight:800; color:${C.maroon};">healingoasis.edu/conference-2026/attend</div>
    <div style="font-size:16px; font-weight:700; letter-spacing:0.10em; text-transform:uppercase; color:#7a3a3a;">Closes Oct 12</div>
  </div>
`
