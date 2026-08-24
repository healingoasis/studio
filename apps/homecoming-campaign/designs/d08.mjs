// 08 — THE TICKET. The registration rates drawn as an actual ticket, stub and
// all. Price posts are dull; an object is not.
import { C } from '../shell.mjs'

// (notches are drawn inline on the stub, top and bottom of the perforation)

export const meta = {
  id: '08-the-ticket',
  date: 'Tuesday, September 15',
  angle: 'Who it is for, and what it costs',
  bg: C.deep,
  caption: `What a seat actually costs.

Veterinary technicians — $450
Doctors, DC / DVM / VMD and other licensed professionals — $580
APRVT candidates — $325
ACVSMR residents — $395

The same rate whether you are in the room in Lombard or on the live stream, and the same CE credit either way.

Discounts stack on top for alumni, association members, and first responders and military — one per registration, all of them expiring October 13.

https://healingoasis.edu/conference-2026/attend`,
}

const row = ([who, what, price], i) => `
  <div style="display:flex; align-items:baseline; justify-content:space-between; gap:18px; padding:17px 0; ${i ? `border-top:1px dashed rgba(92,1,1,0.28);` : ''}">
    <div>
      <div style="font-size:24px; font-weight:800; color:${C.ink}; letter-spacing:-0.01em;">${who}</div>
      <div style="font-size:15px; font-weight:600; color:${C.muted}; margin-top:2px;">${what}</div>
    </div>
    <div style="font-family:'Bitter',Georgia,serif; font-size:38px; font-weight:700; color:${C.maroon}; line-height:1;">${price}</div>
  </div>`

export default `
  <div style="position:absolute; inset:0; background:
      repeating-linear-gradient(135deg, rgba(245,236,223,0.030) 0 3px, rgba(245,236,223,0) 3px 16px), ${C.deep};"></div>

  <div style="position:absolute; top:56px; left:0; right:0; text-align:center;">
    <div style="display:inline-flex; align-items:center; gap:14px;">
      <div style="width:46px; height:46px; border-radius:50%; background:${C.cream}; display:flex; align-items:center; justify-content:center;">
        <img src="../img/logo.png" alt="" style="width:39px; display:block;">
      </div>
      <div style="font-size:16px; font-weight:800; letter-spacing:0.26em; text-transform:uppercase; color:#fff;">2026 Homecoming Conference</div>
    </div>
  </div>

  <div style="position:absolute; left:62px; right:62px; top:154px; bottom:180px; background:${C.paper}; border-radius:8px;
              display:flex; overflow:visible; box-shadow:0 30px 70px rgba(0,0,0,0.45);">

    <div style="flex:1 1 auto; padding:38px 40px 32px; position:relative;
                display:flex; flex-direction:column; justify-content:space-between;">
      <div>
        <div style="font-size:16px; font-weight:800; letter-spacing:0.26em; text-transform:uppercase; color:${C.ember};">Admit one &middot; three days</div>
        <h1 style="font-family:'Bitter',Georgia,serif; font-weight:700; font-size:62px; line-height:0.96; letter-spacing:-0.03em; color:${C.ink}; margin-top:12px;">Resilience<br>in Motion</h1>
        <div style="margin-top:14px; font-size:19px; font-weight:600; color:${C.muted}; line-height:1.45;">October 23&ndash;25, 2026 &middot; Friday to Sunday<br>National University of Health Sciences, Lombard, IL</div>
      </div>

      <div>
        <div style="height:2px; background:rgba(92,1,1,0.20);"></div>
        ${[
          ['Veterinary technicians', 'CVT, RVT, LVT and equivalent', '$450'],
          ['Doctors', 'DC, DVM, VMD &amp; other licensed professionals', '$580'],
          ['APRVT candidates', 'No additional discount applies', '$325'],
          ['ACVSMR residents', 'No additional discount applies', '$395'],
        ].map(row).join('')}
        <div style="height:2px; background:rgba(92,1,1,0.20);"></div>
      </div>

      <div style="font-size:16px; font-weight:600; color:${C.muted}; line-height:1.45;">
        Alumni 15% &middot; association members 10% &middot; first responders &amp; military 20%.<br>One discount per registration; all expire Oct 13.
      </div>
    </div>

    <div style="position:relative; flex:0 0 218px; border-left:3px dashed rgba(92,1,1,0.32);
                display:flex; flex-direction:column; align-items:center; justify-content:center; gap:22px; padding:30px 18px;">
      <div style="position:absolute; left:-20px; top:-19px; width:38px; height:38px; border-radius:50%; background:${C.deep};"></div>
      <div style="position:absolute; left:-20px; bottom:-19px; width:38px; height:38px; border-radius:50%; background:${C.deep};"></div>
      <div style="writing-mode:vertical-rl; transform:rotate(180deg); font-family:'Bitter',Georgia,serif; font-size:54px; font-weight:900; letter-spacing:-0.02em; color:${C.maroon}; line-height:1;">Homecoming</div>
      <div style="text-align:center;">
        <div style="font-size:13px; font-weight:800; letter-spacing:0.20em; text-transform:uppercase; color:${C.muted};">Format</div>
        <div style="font-size:19px; font-weight:800; color:${C.ink}; margin-top:4px; line-height:1.3;">In the room<br>or streamed</div>
      </div>
      <div style="text-align:center;">
        <div style="font-size:13px; font-weight:800; letter-spacing:0.20em; text-transform:uppercase; color:${C.muted};">Closes</div>
        <div style="font-family:'Bitter',Georgia,serif; font-size:34px; font-weight:700; color:${C.maroon}; margin-top:2px;">Oct 12</div>
      </div>
    </div>
  </div>

  <div style="position:absolute; left:0; right:0; bottom:74px; text-align:center;
              font-size:22px; font-weight:800; color:#fff;">healingoasis.edu/conference-2026/attend</div>
  <div style="position:absolute; left:0; right:0; bottom:44px; text-align:center;
              font-size:15px; font-weight:700; letter-spacing:0.16em; text-transform:uppercase; color:rgba(245,236,223,0.62);">Same price in the room or on the stream</div>
`
