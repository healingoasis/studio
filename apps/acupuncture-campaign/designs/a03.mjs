// 03 — THE FACULTY. Five portraits in a staggered run, not a grid. The
// credentials are the argument, so they get set at readable size.
import { C, P, mark } from '../shell.mjs'

export const meta = {
  id: '03-faculty',
  date: 'Sunday, August 30',
  angle: 'Who teaches it',
  bg: C.paper,
  caption: `Who actually teaches this.

Daniel Halden — DC, MAc, LAc, Dipl.Ac (NCCAOM), PAK, CAC, CVMRT
Lynne Dennis — DVM, CVA, FAAVA, CVSMT, CVMRT
Victoria Gnadt — DVM, CVSMT, CVA
Michelle Rivera — MT, VDT
Pedro Rivera — DVM, FACFN, DACVSMR, FCoAC

Among others. Twenty students maximum per class, and we hold the hands-on ratio to three or four students per faculty member — which is the whole reason the hands-on works.

healingoasis.edu/acupuncture`,
}

export default `
  <div style="position:absolute; top:0; left:0; right:0; height:150px; background:${C.maroon}; padding:0 56px;
              display:flex; align-items:center; justify-content:space-between;">
    ${mark('light')}
    <div style="text-align:right; font-size:14px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; line-height:1.55; color:rgba(245,236,223,0.82);">Veterinary Acupuncture<br>Certificate Program</div>
  </div>

  <div style="position:absolute; top:150px; left:0; right:0; padding:44px 56px 0;">
    <div style="font-size:17px; font-weight:800; letter-spacing:0.28em; text-transform:uppercase; color:${C.brass};">The faculty</div>
    <h1 style="margin-top:14px; font-family:'Bitter',Georgia,serif; font-weight:700; font-size:80px; line-height:0.94; letter-spacing:-0.032em; color:${C.ink};">Three or four students<br>to one of them</h1>
  </div>

  <div style="position:absolute; top:452px; left:56px; right:56px;">
    ${P.faculty.map(([file, name, cred], i) => `
      <div style="display:flex; align-items:center; gap:26px; padding:14px 0; ${i ? 'border-top:1px solid rgba(92,1,1,0.14);' : ''}">
        <img src="../img/faculty/${file}.jpg" alt="${name}" style="width:104px; height:104px; border-radius:50%; object-fit:cover; object-position:50% 30%; flex-shrink:0; border:3px solid ${i % 2 ? C.brass : C.maroon};">
        <div>
          <div style="font-family:'Bitter',Georgia,serif; font-size:34px; font-weight:700; color:${C.ink}; letter-spacing:-0.018em; line-height:1.1;">${name}</div>
          <div style="margin-top:5px; font-size:16px; font-weight:700; color:${C.maroon}; letter-spacing:0.01em;">${cred}</div>
        </div>
      </div>`).join('')}
    <div style="padding-top:16px; border-top:1px solid rgba(92,1,1,0.14); font-size:19px; font-weight:600; color:${C.muted};">&mdash; among others.</div>
  </div>

  <div style="position:absolute; left:56px; right:56px; bottom:112px; background:${C.cream}; border-left:5px solid ${C.brass}; padding:22px 26px;">
    <div style="font-size:21px; font-weight:700; color:${C.ink}; line-height:1.4;">Twenty students maximum per class. For clinical hands-on we hold the ratio to ${P.ratio}.</div>
  </div>

  <div style="position:absolute; left:0; right:0; bottom:0; height:92px; background:${C.maroon}; padding:0 56px;
              display:flex; align-items:center; justify-content:space-between;">
    <div style="font-size:23px; font-weight:800; color:#fff;">${P.url}</div>
    <div style="font-size:15px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:rgba(245,236,223,0.78);">Module I &middot; Sept 16, 2026</div>
  </div>
`
