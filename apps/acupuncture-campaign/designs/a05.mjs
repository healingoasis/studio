// 05 — THE FORMAT. Five modules drawn as five cards, three screens and two
// buildings, so the hybrid shape is understood before a word is read.
import { C, P, mark } from '../shell.mjs'

export const meta = {
  id: '05-hybrid-format',
  date: 'Thursday, September 3',
  angle: 'Hybrid — three online, two in person',
  bg: C.paper,
  caption: `Three of the five modules never ask you to travel.

Modules I, III and IV are Virtual-Live — Wednesday to Sunday, 8am to noon each day, from wherever you are. Modules II and V are face-to-face in Sturtevant, Wisconsin, and those are the long days with your hands on a patient.

That is the whole programme: five modules, 132 supervised hours, no required externships.

healingoasis.edu/acupuncture`,
}

const screen = (col) => `
  <svg viewBox="0 0 24 24" width="42" height="42" fill="none" stroke="${col}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <rect x="2.5" y="4" width="19" height="13" rx="1.6"></rect>
    <path d="M8.5 20.5h7"></path><path d="M12 17v3.5"></path>
  </svg>`

const building = (col) => `
  <svg viewBox="0 0 24 24" width="42" height="42" fill="none" stroke="${col}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M3 21h18"></path><path d="M5 21V8l7-4 7 4v13"></path>
    <path d="M9.5 21v-5h5v5"></path>
  </svg>`

export default `
  <div style="position:absolute; top:0; left:0; right:0; height:132px; background:${C.maroon}; padding:0 56px;
              display:flex; align-items:center;">${mark('light')}</div>

  <div style="position:absolute; top:132px; left:0; right:0; padding:44px 56px 0;">
    <div style="font-size:17px; font-weight:800; letter-spacing:0.28em; text-transform:uppercase; color:${C.brass};">The format</div>
    <h1 style="margin-top:14px; font-family:'Bitter',Georgia,serif; font-weight:700; font-size:82px; line-height:0.94; letter-spacing:-0.034em; color:${C.ink};">Three of the five<br>never move you</h1>
    <p style="margin-top:20px; font-size:22px; line-height:1.48; font-weight:500; color:${C.muted}; max-width:820px;">Virtual-Live modules run Wednesday to Sunday, 8am to noon, from wherever you are. The two face-to-face modules are the long days &mdash; the ones with your hands on a patient.</p>
  </div>

  <div style="position:absolute; top:560px; left:56px; right:56px; display:grid; grid-template-columns:repeat(5, minmax(0,1fr)); gap:14px;">
    ${P.schedule.map(([n, when, mode]) => {
      const f2f = mode === 'Face-to-Face'
      return `
      <div style="background:${f2f ? C.maroon : C.cream}; border:2px solid ${f2f ? C.maroon : 'rgba(92,1,1,0.18)'}; border-radius:5px; padding:22px 14px 20px; text-align:center; min-height:452px; display:flex; flex-direction:column; align-items:center; justify-content:space-between;">
        <div style="font-family:'Bitter',Georgia,serif; font-size:44px; font-weight:700; line-height:1; color:${f2f ? C.brass : C.maroon};">${n}</div>
        <div>${f2f ? building('#fff') : screen(C.maroon)}</div>
        <div>
          <div style="font-size:14px; font-weight:800; letter-spacing:0.10em; text-transform:uppercase; color:${f2f ? C.brass : C.muted}; line-height:1.35;">${mode.replace('-', '-<br>')}</div>
          <div style="margin-top:8px; font-size:15px; font-weight:700; color:${f2f ? '#fff' : C.ink}; line-height:1.3;">${when.replace(', ', ',<br>')}</div>
        </div>
      </div>`
    }).join('')}
  </div>

  <div style="position:absolute; left:56px; right:56px; bottom:132px; display:flex; gap:30px; align-items:center;">
    <div style="display:flex; align-items:center; gap:10px;">
      <div style="width:16px; height:16px; border-radius:3px; background:${C.cream}; border:2px solid rgba(92,1,1,0.30);"></div>
      <div style="font-size:17px; font-weight:700; color:${C.muted};">Virtual-Live, from anywhere</div>
    </div>
    <div style="display:flex; align-items:center; gap:10px;">
      <div style="width:16px; height:16px; border-radius:3px; background:${C.maroon};"></div>
      <div style="font-size:17px; font-weight:700; color:${C.muted};">Face-to-face in ${P.place}</div>
    </div>
  </div>

  <div style="position:absolute; left:0; right:0; bottom:0; height:96px; background:${C.maroon}; padding:0 56px;
              display:flex; align-items:center; justify-content:space-between;">
    <div style="font-size:23px; font-weight:800; color:#fff;">${P.url}</div>
    <div style="font-size:15px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:rgba(245,236,223,0.78);">132 hours &middot; no externships</div>
  </div>
`
