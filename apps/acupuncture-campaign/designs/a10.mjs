// 10 — AFTER THE CERTIFICATE. The graduate benefits, which are the part nobody
// reads on a programme page and the part that closes hesitant people.
import { C, P, mark } from '../shell.mjs'

export const meta = {
  id: '10-after-the-certificate',
  date: 'Saturday, September 12',
  angle: 'What graduation actually gets you',
  bg: C.cream,
  caption: `The part of the programme page nobody scrolls to.

Every successful graduate of the Healing Oasis Wellness Center receives:

— Unlimited access to consultations with the programme director
— A listing in our Find a Graduate / Alumni section
— Access to the VSMT alumni section, which holds all the technique and explanation films used during the programme
— A percentage discount on our continuing education seminars and yearly conference
— 10% off if you register, or send an associate or credentialed technician, to the VMRT postgraduate programme

The certificate is where it starts, not where it stops.

healingoasis.edu/acupuncture`,
}

const BENEFITS = [
  ['01', 'Unlimited consultations', 'With the programme director. Not a support window &mdash; unlimited, for as long as you want them.'],
  ['02', 'Listed as a graduate', 'Your name in the Find a Graduate / Alumni section, where people go looking.'],
  ['03', 'The film library', 'Access to the VSMT alumni section, holding every technique and explanation film used during the programme.'],
  ['04', 'Discounted CE', 'A percentage discount on our continuing education seminars and the yearly conference.'],
  ['05', '10% off the VMRT programme', 'For you, or for an associate or credentialed veterinary technician you send.'],
]

export default `
  <div style="position:absolute; top:0; left:0; right:0; height:220px; background:${C.maroon}; padding:44px 56px 0;">
    ${mark('light')}
    <div style="margin-top:22px; font-size:17px; font-weight:800; letter-spacing:0.28em; text-transform:uppercase; color:${C.brass};">After the certificate</div>
  </div>

  <div style="position:absolute; top:220px; left:0; right:0; padding:34px 56px 0;">
    <h1 style="font-family:'Bitter',Georgia,serif; font-weight:700; font-size:76px; line-height:0.94; letter-spacing:-0.032em; color:${C.ink};">It does not end<br>at the certificate</h1>
  </div>

  <div style="position:absolute; top:430px; left:56px; right:56px;">
    ${BENEFITS.map(([n, t, d]) => `
      <div style="display:grid; grid-template-columns:76px 1fr; gap:22px; padding:24px 0; border-bottom:1px solid rgba(92,1,1,0.16);">
        <div style="font-family:'Bitter',Georgia,serif; font-size:34px; font-weight:700; color:${C.brass}; line-height:1;">${n}</div>
        <div>
          <div style="font-size:27px; font-weight:800; color:${C.ink}; letter-spacing:-0.012em; line-height:1.15;">${t}</div>
          <div style="margin-top:6px; font-size:18px; font-weight:500; line-height:1.42; color:${C.muted};">${d}</div>
        </div>
      </div>`).join('')}
  </div>

  <div style="position:absolute; left:0; right:0; bottom:96px; padding:0 56px; height:112px; display:flex; align-items:center;">
    <div style="font-family:'Bitter',Georgia,serif; font-style:italic; font-size:30px; font-weight:700; color:${C.maroon}; line-height:1.3;">The certificate is where it starts, not where it stops.</div>
  </div>

  <div style="position:absolute; left:0; right:0; bottom:0; height:96px; background:${C.maroon}; padding:0 56px;
              display:flex; align-items:center; justify-content:space-between;">
    <div style="font-size:23px; font-weight:800; color:#fff;">${P.url}</div>
    <div style="font-size:15px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:rgba(245,236,223,0.78);">Module I &middot; Sept 16, 2026</div>
  </div>
`
