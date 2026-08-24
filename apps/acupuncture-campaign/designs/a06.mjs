// 06 — THE SPEC SHEET. Awareness post, written as a specification rather than
// a pitch. Everything on it is quoted from the program page; no claims are
// made about what acupuncture does, only about how it is taught here.
import { C, P, mark } from '../shell.mjs'

export const meta = {
  id: '06-taught-properly',
  date: 'Saturday, September 5',
  angle: 'Awareness — how the modality is taught',
  bg: C.cream,
  caption: `If the school is going to teach a modality, this is the standard it gets held to.

Built on the fundamentals consistent with the practice of acupuncture in the United States and with the National Certification Commission for Acupuncture and Oriental Medicine.

132 hours of supervised training. Extensive hands-on clinical practicums. Two cases presented in SOAP format to the program director for evaluation. Continuing Education contact hours through the AHVMA, an AVMA-HOD-recognized organization.

Canine and equine. Twenty students maximum.

healingoasis.edu/acupuncture`,
}

const spec = ([k, v], i) => `
  <div style="display:grid; grid-template-columns:210px 1fr; gap:26px; padding:29px 0; ${i ? 'border-top:1px solid rgba(92,1,1,0.16);' : ''}">
    <div style="font-size:15px; font-weight:800; letter-spacing:0.15em; text-transform:uppercase; color:${C.brass}; padding-top:5px;">${k}</div>
    <div style="font-size:21px; font-weight:600; line-height:1.42; color:${C.ink};">${v}</div>
  </div>`

export default `
  <div style="position:absolute; top:0; left:0; right:0; height:400px; overflow:hidden;">
    <img src="../img/detail-dog.jpg" alt="" style="width:1080px; height:400px; object-fit:cover; object-position:50% 44%; display:block;">
    <div style="position:absolute; inset:0; background:linear-gradient(180deg, rgba(26,8,8,0.72) 0%, rgba(26,8,8,0.24) 40%, rgba(245,236,223,0.10) 74%, ${C.cream} 100%);"></div>
    <div style="position:absolute; top:50px; left:56px; right:56px;">${mark('light')}</div>
  </div>

  <div style="position:absolute; top:318px; left:56px; right:56px;">
    <div style="font-size:17px; font-weight:800; letter-spacing:0.28em; text-transform:uppercase; color:${C.brass};">The standard</div>
    <h1 style="margin-top:14px; font-family:'Bitter',Georgia,serif; font-weight:700; font-size:78px; line-height:0.94; letter-spacing:-0.032em; color:${C.ink};">Taught the way<br>it is practiced</h1>
  </div>

  <div style="position:absolute; top:560px; left:56px; right:56px;">
    ${[
      ['Grounding', 'Built on the fundamentals consistent with the practice of acupuncture in the United States, and with the National Certification Commission for Acupuncture and Oriental Medicine.'],
      ['Training', '132 hours of supervised training across five modules, with extensive hands-on clinical practicums.'],
      ['Assessment', 'Two cases presented in SOAP format to the program director for evaluation during Module IV or V.'],
      ['CE credit', 'Continuing Education contact hours provided by the AHVMA, an AVMA-HOD-recognized organization.'],
      ['Species', 'Canine and equine.'],
    ].map(spec).join('')}
  </div>

  <div style="position:absolute; left:0; right:0; bottom:0; height:98px; background:${C.maroon}; padding:0 56px;
              display:flex; align-items:center; justify-content:space-between;">
    <div style="font-size:23px; font-weight:800; color:#fff;">${P.url}</div>
    <div style="font-size:15px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:rgba(245,236,223,0.78);">Module I &middot; Sept 16, 2026</div>
  </div>
`
