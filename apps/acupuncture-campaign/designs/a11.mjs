// 11 — WHAT IT COSTS. Money post. Two figures, stated plainly, on a field of
// cream. Vagueness about price loses more enrollments than the price does.
import { C, P, mark } from '../shell.mjs'

export const meta = {
  id: '11-what-it-costs',
  date: 'Sunday, September 13',
  angle: 'The money, stated plainly',
  bg: C.paper,
  caption: `Let us be plain about the money.

$200 holds your seat. The balance is $7,900.24 by check — card payments carry a 3.4% processing fee.

That covers 132 hours of supervised training across five modules, extensive hands-on clinical practicums, and no required additional externships, which means no extra travel and no extra weeks away from your practice on top of the five.

Both enrollment options are on the program page.

healingoasis.edu/acupuncture`,
}

export default `
  <div style="position:absolute; top:0; left:0; right:0; height:130px; background:${C.deep}; padding:0 56px;
              display:flex; align-items:center;">${mark('light')}</div>

  <div style="position:absolute; top:130px; left:0; right:0; padding:50px 56px 0;">
    <div style="font-size:17px; font-weight:800; letter-spacing:0.28em; text-transform:uppercase; color:${C.brass};">The money</div>
    <h1 style="margin-top:14px; font-family:'Bitter',Georgia,serif; font-weight:700; font-size:84px; line-height:0.94; letter-spacing:-0.034em; color:${C.ink};">Plainly, then</h1>
  </div>

  <div style="position:absolute; top:400px; left:56px; right:56px; display:grid; grid-template-columns:1fr 1fr; gap:20px;">
    <div style="background:${C.maroon}; border-radius:6px; padding:40px 36px 36px;">
      <div style="font-size:15px; font-weight:800; letter-spacing:0.22em; text-transform:uppercase; color:${C.brass};">To hold a seat</div>
      <div style="margin-top:18px; font-family:'Bitter',Georgia,serif; font-size:104px; font-weight:900; line-height:0.9; letter-spacing:-0.045em; color:#fff;">${P.deposit}</div>
      <div style="margin-top:16px; font-size:19px; font-weight:600; line-height:1.45; color:rgba(245,236,223,0.82);">A deposit. One of twenty seats in the Fall 2026 class.</div>
    </div>
    <div style="background:${C.cream}; border:2px solid rgba(92,1,1,0.20); border-radius:6px; padding:40px 36px 36px;">
      <div style="font-size:15px; font-weight:800; letter-spacing:0.22em; text-transform:uppercase; color:${C.brass};">The balance</div>
      <div style="margin-top:18px; font-family:'Bitter',Georgia,serif; font-size:72px; font-weight:900; line-height:0.9; letter-spacing:-0.04em; color:${C.maroon};">${P.balance}</div>
      <div style="margin-top:16px; font-size:19px; font-weight:600; line-height:1.45; color:${C.muted};">By check. Card payments carry a 3.4% processing fee.</div>
    </div>
  </div>

  <div style="position:absolute; left:56px; right:56px; top:830px;">
    <div style="font-size:15px; font-weight:800; letter-spacing:0.22em; text-transform:uppercase; color:${C.brass};">Which buys</div>
    <div style="margin-top:20px;">
      ${[
        ['132 hours', 'of supervised training, across five modules'],
        ['Hands-on practicums', 'three or four students to one faculty member'],
        ['No externships', 'no extra weeks away on top of the five'],
        ['Canine and equine', 'both, in the same program'],
      ].map(([a, b], i) => `
        <div style="display:flex; align-items:baseline; gap:20px; padding:15px 0; ${i ? 'border-top:1px solid rgba(92,1,1,0.14);' : ''}">
          <div style="width:280px; flex-shrink:0; font-size:23px; font-weight:800; color:${C.ink};">${a}</div>
          <div style="font-size:19px; font-weight:500; color:${C.muted};">${b}</div>
        </div>`).join('')}
    </div>
  </div>

  <div style="position:absolute; left:0; right:0; bottom:0; height:104px; background:${C.deep}; padding:0 56px;
              display:flex; align-items:center; justify-content:space-between;">
    <div style="font-size:24px; font-weight:800; color:#fff;">${P.url}</div>
    <div style="font-size:15px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:${C.brass};">Fall 2026 &middot; Parts I&ndash;V</div>
  </div>
`
