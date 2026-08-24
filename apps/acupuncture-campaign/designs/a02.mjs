// 02 — THE HOURS, BROKEN DOWN. Not a big number: five bars that add to 132,
// so the reader sees the shape of the commitment rather than a claim.
import { C, P, mark } from '../shell.mjs'

export const meta = {
  id: '02-the-hours',
  date: 'Friday, August 28',
  angle: '132 hours, and where they go',
  bg: C.maroon,
  caption: `132 hours of supervised training. Here is where they go.

Five modules, Wednesday to Sunday each time. Three are Virtual-Live, running 8am to noon daily. Two are face-to-face in Sturtevant, Wisconsin — those days run long, and they are the ones with your hands on a patient.

Extensive hands-on clinical practicums, and no required additional externships. Five long weekends, not a year away from your practice.

healingoasis.edu/acupuncture`,
}

const BARS = [
  ['I',   'Sept 16–20, 2026', 'Virtual-Live', 62],
  ['II',  'Oct 14–18, 2026',  'Face-to-Face', 100],
  ['III', 'Dec 9–13, 2026',   'Virtual-Live', 62],
  ['IV',  'Jan 6–10, 2027',   'Virtual-Live', 62],
  ['V',   'Feb 3–7, 2027',    'Face-to-Face', 100],
]

export default `
  <div style="position:absolute; top:0; left:0; right:0; padding:52px 60px 0;">
    ${mark('light')}
  </div>

  <div style="position:absolute; top:190px; left:60px; right:60px;">
    <div style="display:flex; align-items:flex-end; gap:26px;">
      <div style="font-family:'Bitter',Georgia,serif; font-size:210px; font-weight:900; line-height:0.78; letter-spacing:-0.06em; color:${C.cream};">${P.hours}</div>
      <div style="padding-bottom:22px;">
        <div style="font-size:30px; font-weight:800; letter-spacing:0.16em; text-transform:uppercase; color:${C.brass}; line-height:1.2;">hours of<br>supervised training</div>
      </div>
    </div>
    <p style="margin-top:26px; font-size:22px; line-height:1.5; font-weight:500; color:rgba(245,236,223,0.86); max-width:880px;">Across five modules, Wednesday to Sunday each time. Three run Virtual-Live from 8am to noon. Two are face-to-face, and those are the long days.</p>
  </div>

  <div style="position:absolute; top:540px; left:60px; right:60px;">
    ${BARS.map(([n, when, mode, w]) => `
      <div style="display:flex; align-items:center; gap:22px; padding:19px 0;">
        <div style="width:52px; flex-shrink:0; font-family:'Bitter',Georgia,serif; font-size:34px; font-weight:700; color:rgba(245,236,223,0.60); line-height:1;">${n}</div>
        <div style="flex-grow:1;">
          <div style="height:34px; width:${w}%; background:${mode === 'Face-to-Face' ? C.brass : 'rgba(245,236,223,0.34)'}; border-radius:2px;"></div>
          <div style="margin-top:8px; display:flex; gap:16px; align-items:baseline;">
            <div style="font-size:18px; font-weight:800; color:#fff;">${when}</div>
            <div style="font-size:15px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:${mode === 'Face-to-Face' ? C.brass : 'rgba(245,236,223,0.62)'};">${mode}</div>
          </div>
        </div>
      </div>`).join('')}
  </div>

  <div style="position:absolute; left:60px; right:60px; bottom:118px; padding-top:24px; border-top:2px solid rgba(245,236,223,0.26);">
    <div style="font-size:23px; font-weight:700; color:#fff; line-height:1.4;">No required additional externships.<br><span style="color:rgba(245,236,223,0.70); font-weight:500;">Five long weekends &mdash; not a year away from your practice.</span></div>
  </div>

  <div style="position:absolute; left:0; right:0; bottom:0; height:88px; background:${C.cream}; padding:0 60px;
              display:flex; align-items:center; justify-content:space-between;">
    <div style="font-size:23px; font-weight:800; color:${C.maroon};">${P.url}</div>
    <div style="font-size:15px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:#7a3a3a;">Begins Sept 16</div>
  </div>
`
