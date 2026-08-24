// 09 — TWENTY SEATS. The class cap drawn as twenty marks, so scarcity is shown
// rather than asserted. No claim is made about how many remain.
import { C, P, mark } from '../shell.mjs'

export const meta = {
  id: '09-twenty-seats',
  date: 'Friday, September 11',
  angle: 'Class size — twenty, and why it matters',
  bg: C.paper,
  caption: `Twenty. That is the whole class.

There is a maximum of twenty students per class, and for clinical hands-on we hold the ratio to three or four students per faculty member.

That number is not a marketing decision. It is the number at which a room full of people can each get their hands on a patient with someone experienced standing beside them — which is the only way this is learned.

Module I begins September 16, 2026.
healingoasis.edu/acupuncture`,
}

export default `
  <div style="position:absolute; top:0; left:0; right:0; height:132px; background:${C.maroon}; padding:0 56px;
              display:flex; align-items:center;">${mark('light')}</div>

  <div style="position:absolute; top:132px; left:0; right:0; padding:48px 56px 0;">
    <div style="font-size:17px; font-weight:800; letter-spacing:0.28em; text-transform:uppercase; color:${C.brass};">Class size</div>
    <h1 style="margin-top:14px; font-family:'Bitter',Georgia,serif; font-weight:900; font-size:132px; line-height:0.86; letter-spacing:-0.05em; color:${C.maroon};">Twenty.</h1>
    <p style="margin-top:22px; font-size:24px; line-height:1.45; font-weight:500; color:${C.ink}; max-width:820px;">That is the whole class. A maximum of twenty students, and for clinical hands-on we hold the ratio to three or four students per faculty member.</p>
  </div>

  <div style="position:absolute; top:590px; left:56px; right:56px;">
    <div style="display:grid; grid-template-columns:repeat(10, 1fr); gap:16px;">
      ${Array.from({ length: 20 }, (_, i) => `
        <svg viewBox="0 0 24 24" width="100%" height="82" fill="none" stroke="${i < 4 ? C.brass : C.maroon}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="7.5" r="3.6"></circle>
          <path d="M4.6 20.5c0-4.1 3.3-7.4 7.4-7.4s7.4 3.3 7.4 7.4"></path>
        </svg>`).join('')}
    </div>
    <div style="margin-top:26px; display:flex; gap:32px; align-items:center;">
      <div style="display:flex; align-items:center; gap:10px;">
        <div style="width:14px; height:14px; border-radius:50%; background:${C.brass};"></div>
        <div style="font-size:17px; font-weight:700; color:${C.muted};">One faculty member covers three or four</div>
      </div>
    </div>
  </div>

  <div style="position:absolute; left:56px; right:56px; bottom:230px; padding-top:30px; border-top:2px solid rgba(92,1,1,0.18);">
    <p style="font-size:26px; line-height:1.42; font-weight:600; color:${C.ink};">That number is not a marketing decision. It is the number at which everyone in the room gets their hands on a patient with someone experienced standing beside them.</p>
  </div>

  <div style="position:absolute; left:56px; right:56px; bottom:130px; display:flex; gap:14px;">
    ${[['132 hours'], ['5 modules'], ['Canine & equine'], ['No externships']].map(([t]) => `
      <div style="flex:1; background:${C.cream}; border-radius:3px; padding:15px 0; text-align:center;
                  font-size:16px; font-weight:800; color:${C.maroon};">${t}</div>`).join('')}
  </div>

  <div style="position:absolute; left:0; right:0; bottom:0; height:96px; background:${C.maroon}; padding:0 56px;
              display:flex; align-items:center; justify-content:space-between;">
    <div style="font-size:23px; font-weight:800; color:#fff;">${P.url}</div>
    <div style="font-size:15px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:rgba(245,236,223,0.78);">Module I &middot; Sept 16, 2026</div>
  </div>
`
