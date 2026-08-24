// 11 — THE DISCOUNTS. Three percentages as three slabs of colour, stacked and
// bleeding off the edge. No photograph; the numbers are the picture.
import { C } from '../shell.mjs'

export const meta = {
  id: '11-discounts',
  date: 'Thursday, September 24',
  angle: 'Discounts — do not overpay',
  bg: C.paper,
  caption: `Before you check out — make sure you are not paying more than you have to.

20% — first responders and military. Active duty and veterans, plus fire, EMS and law enforcement.
15% — Healing Oasis alumni.
10% — association members in good standing.

Codes go in at the checkout and official documentation is required. One discount per registration, and all of them expire October 13.

Not sure which one you qualify for? Ask us — we would rather you paid the right price.

https://healingoasis.edu/conference-2026/attend`,
}

const slab = ({ pct, who, note, bg, ink, sub }) => `
  <div style="position:relative; background:${bg}; padding:32px 54px; display:flex; align-items:center; gap:36px;">
    <div style="font-family:'Bitter',Georgia,serif; font-size:132px; font-weight:900; line-height:0.84; letter-spacing:-0.05em; color:${ink}; flex-shrink:0; width:280px;">${pct}</div>
    <div>
      <div style="font-size:34px; font-weight:800; color:${ink}; letter-spacing:-0.015em; line-height:1.1;">${who}</div>
      <div style="margin-top:8px; font-size:18px; font-weight:600; color:${sub}; line-height:1.4;">${note}</div>
    </div>
  </div>`

export default `
  <div style="position:absolute; top:0; left:0; right:0; padding:52px 54px 34px;">
    <div style="display:flex; align-items:center; justify-content:space-between;">
      <div style="display:flex; align-items:center; gap:14px;">
        <div style="width:48px; height:48px; border-radius:50%; background:${C.cream}; border:2px solid ${C.maroon}; display:flex; align-items:center; justify-content:center;">
          <img src="../img/logo.png" alt="" style="width:38px; display:block;">
        </div>
        <div style="font-size:16px; font-weight:800; letter-spacing:0.22em; text-transform:uppercase; color:${C.maroon};">2026 Homecoming Conference</div>
      </div>
      <div style="font-size:14px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; color:${C.muted};">Oct 23&ndash;25 &middot; Lombard, IL</div>
    </div>

    <div style="margin-top:44px; font-size:18px; font-weight:800; letter-spacing:0.26em; text-transform:uppercase; color:${C.ember};">Before you check out</div>
    <h1 style="font-family:'Bitter',Georgia,serif; font-weight:700; font-size:88px; line-height:0.94; letter-spacing:-0.035em; color:${C.ink}; margin-top:12px;">You may be<br>paying too much</h1>
  </div>

  <div style="position:absolute; top:452px; left:0; right:0;">
    ${slab({ pct: '20%', who: 'First responders &amp; military',
             note: 'Active duty and veterans, fire, EMS and law enforcement',
             bg: C.maroon, ink: '#fff', sub: 'rgba(245,236,223,0.78)' })}
    ${slab({ pct: '15%', who: 'Healing Oasis alumni',
             note: 'Graduates of any Healing Oasis certification programme',
             bg: C.ember, ink: '#fff', sub: 'rgba(255,255,255,0.86)' })}
    ${slab({ pct: '10%', who: 'Association members',
             note: 'Members in good standing &middot; official letter required',
             bg: '#e8dcc8', ink: C.ink, sub: C.muted })}
  </div>

  <div style="position:absolute; left:0; right:0; bottom:120px; padding:0 54px;">
    <p style="font-size:20px; line-height:1.5; font-weight:600; color:${C.ink};">Codes are applied at the checkout and official documentation is required. One discount per registration &mdash; and every one of them expires <strong style="color:${C.maroon};">October 13</strong>.</p>
  </div>

  <div style="position:absolute; left:0; right:0; bottom:0; height:96px; background:${C.deep}; padding:0 54px;
              display:flex; align-items:center; justify-content:space-between;">
    <div style="font-size:22px; font-weight:800; color:#fff;">healingoasis.edu/conference-2026/attend</div>
    <div style="font-size:16px; font-weight:700; letter-spacing:0.10em; text-transform:uppercase; color:rgba(245,236,223,0.76);">Registration closes Oct 12</div>
  </div>
`
