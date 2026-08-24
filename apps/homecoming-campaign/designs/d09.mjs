// 09 — THE CALENDAR. Every date that matters, on an actual calendar. This is
// the post people screenshot and keep.
import { C } from '../shell.mjs'

export const meta = {
  id: '09-the-calendar',
  date: 'Friday, September 18',
  angle: 'Every deadline in one place',
  bg: C.paper,
  caption: `Four dates. Screenshot this one.

SEPTEMBER 16 — the hotel block at the Crowne Plaza Lombard–Downers Grove is released. Call (630) 629-6000 and mention the conference before then.

OCTOBER 12 — registration closes. In the room or on the stream, both shut the same day.

OCTOBER 13 — every discount code expires.

OCTOBER 23–25 — we open the doors in Lombard.

https://healingoasis.edu/conference-2026/attend`,
}

// October 2026 opens on a Thursday, which puts the conference on Fri–Sun.
const SEP = { name: 'September', lead: 2, days: 30 }
const OCT = { name: 'October',   lead: 4, days: 31 }
const MARKS = {
  September: { 16: 'hotel' },
  October:   { 12: 'close', 13: 'close', 23: 'conf', 24: 'conf', 25: 'conf' },
}
const TONE = {
  conf:  `background:${C.maroon}; color:#fff;`,
  close: `background:${C.ember}; color:#fff;`,
  hotel: `background:${C.ember}; color:#fff;`,
}

const month = (m) => {
  const cells = []
  for (let i = 0; i < m.lead; i++) cells.push('<div></div>')
  for (let d = 1; d <= m.days; d++) {
    const mark = MARKS[m.name]?.[d]
    cells.push(`<div style="height:74px; display:flex; align-items:center; justify-content:center;
      font-size:26px; font-weight:${mark ? '800' : '600'}; border-radius:4px;
      ${mark ? TONE[mark] : `color:${C.ink};`}">${d}</div>`)
  }
  return `
    <div>
      <div style="font-family:'Bitter',Georgia,serif; font-size:40px; font-weight:700; color:${C.ink}; letter-spacing:-0.02em;">${m.name} <span style="color:${C.muted}; font-weight:400;">2026</span></div>
      <div style="margin-top:14px; display:grid; grid-template-columns:repeat(7, 1fr); gap:6px;">
        ${['S','M','T','W','T','F','S'].map(d => `<div style="height:32px; display:flex; align-items:center; justify-content:center; font-size:15px; font-weight:800; letter-spacing:0.10em; color:${C.muted};">${d}</div>`).join('')}
        ${cells.join('')}
      </div>
    </div>`
}

const key = (tone, label, note) => `
  <div style="display:flex; align-items:flex-start; gap:12px;">
    <div style="width:20px; height:20px; border-radius:4px; ${TONE[tone]} flex-shrink:0; margin-top:3px;"></div>
    <div>
      <div style="font-size:19px; font-weight:800; color:${C.ink}; line-height:1.2;">${label}</div>
      <div style="font-size:15px; font-weight:600; color:${C.muted}; margin-top:2px; line-height:1.35;">${note}</div>
    </div>
  </div>`

export default `
  <div style="position:absolute; top:0; left:0; right:0; height:112px; background:${C.maroon};
              display:flex; align-items:center; justify-content:space-between; padding:0 54px;">
    <div style="display:flex; align-items:center; gap:14px;">
      <div style="width:48px; height:48px; border-radius:50%; background:${C.cream}; display:flex; align-items:center; justify-content:center;">
        <img src="../img/logo.png" alt="" style="width:40px; display:block;">
      </div>
      <div style="font-size:16px; font-weight:800; letter-spacing:0.22em; text-transform:uppercase; color:#fff;">2026 Homecoming Conference</div>
    </div>
    <div style="font-size:14px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; color:rgba(245,236,223,0.84);">Lombard, Illinois</div>
  </div>

  <div style="position:absolute; top:112px; left:0; right:0; padding:44px 54px 0;">
    <div style="font-size:18px; font-weight:800; letter-spacing:0.26em; text-transform:uppercase; color:${C.ember};">Mark the calendar</div>
    <h1 style="font-family:'Bitter',Georgia,serif; font-weight:700; font-size:74px; line-height:0.96; letter-spacing:-0.03em; color:${C.ink}; margin-top:12px;">Four dates that<br>decide it</h1>

    <div style="margin-top:34px; display:grid; grid-template-columns:1fr 1fr; gap:40px;">
      ${month(SEP)}
      ${month(OCT)}
    </div>

    <div style="margin-top:38px; padding-top:30px; border-top:2px solid rgba(92,1,1,0.18);
                display:grid; grid-template-columns:1fr 1fr; gap:22px 40px;">
      ${key('hotel', 'Sept 16 — hotel block released', 'Crowne Plaza Lombard&ndash;Downers Grove &middot; (630) 629-6000')}
      ${key('close', 'Oct 12 — registration closes', 'In the room or on the stream, both shut the same day')}
      ${key('close', 'Oct 13 — discount codes expire', 'Alumni, association, first responders &amp; military')}
      ${key('conf',  'Oct 23–25 — the conference', 'Friday to Sunday, National University of Health Sciences')}
    </div>
  </div>

  <div style="position:absolute; left:0; right:0; bottom:0; height:88px; background:${C.maroon}; padding:0 54px;
              display:flex; align-items:center; justify-content:space-between;">
    <div style="font-size:22px; font-weight:800; color:#fff;">healingoasis.edu/conference-2026/attend</div>
    <div style="font-size:16px; font-weight:700; letter-spacing:0.10em; text-transform:uppercase; color:rgba(245,236,223,0.78);">Sixteen speakers &middot; 20 CE hours</div>
  </div>
`
