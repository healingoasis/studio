// 08 — THE SEAL. A certificate mark, drawn. Credential posts are usually a
// wall of acronyms; this one puts the acronyms inside an object.
import { C, P, mark } from '../shell.mjs'

export const meta = {
  id: '08-the-seal',
  date: 'Wednesday, September 9',
  angle: 'Credentials — NCCAOM fundamentals, AHVMA credit',
  bg: C.deep,
  caption: `What the certificate is standing on.

The program is built on the fundamentals consistent with the practice of acupuncture in the United States and with the National Certification Commission for Acupuncture and Oriental Medicine.

Continuing Education contact hours are provided by the American Holistic Veterinary Medical Association, an AVMA-HOD-recognized organization.

132 supervised hours. Two SOAP cases evaluated by the program director. Twenty students maximum.

healingoasis.edu/acupuncture`,
}

export default `
  <div style="position:absolute; inset:0; background:
      repeating-linear-gradient(45deg, rgba(245,236,223,0.028) 0 2px, rgba(0,0,0,0) 2px 18px), ${C.deep};"></div>

  <div style="position:absolute; top:52px; left:56px; right:56px;">${mark('light')}</div>

  <div style="position:absolute; top:212px; left:0; right:0; display:flex; justify-content:center;">
    <div style="width:520px; height:520px; border-radius:50%; border:4px solid ${C.brass};
                display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:0 54px;">
      <div style="width:440px; height:440px; border-radius:50%; border:1px solid rgba(168,123,46,0.45); position:absolute;"></div>
      <div style="font-size:15px; font-weight:800; letter-spacing:0.30em; text-transform:uppercase; color:${C.brass};">Certificate</div>
      <div style="margin-top:14px; font-family:'Bitter',Georgia,serif; font-size:112px; font-weight:900; line-height:0.86; letter-spacing:-0.05em; color:${C.cream};">${P.hours}</div>
      <div style="margin-top:6px; font-size:17px; font-weight:800; letter-spacing:0.18em; text-transform:uppercase; color:rgba(245,236,223,0.80); line-height:1.4;">supervised<br>hours</div>
      <div style="margin-top:18px; width:70px; height:2px; background:${C.brass};"></div>
      <div style="margin-top:16px; font-size:16px; font-weight:700; color:rgba(245,236,223,0.72); line-height:1.4;">Canine &amp; Equine<br>Five modules</div>
    </div>
  </div>

  <div style="position:absolute; top:788px; left:56px; right:56px; text-align:center;">
    <h1 style="font-family:'Bitter',Georgia,serif; font-weight:700; font-size:66px; line-height:0.98; letter-spacing:-0.03em; color:#fff;">What it stands on</h1>
  </div>

  <div style="position:absolute; left:56px; right:56px; bottom:200px; display:grid; grid-template-columns:1fr 1fr; gap:18px;">
    ${[
      ['NCCAOM', 'Built on the fundamentals consistent with the practice of acupuncture in the United States and with the National Certification Commission for Acupuncture and Oriental Medicine.'],
      ['AHVMA', 'Continuing Education contact hours provided by the American Holistic Veterinary Medical Association, an AVMA-HOD-recognized organization.'],
    ].map(([a, b]) => `
      <div style="border:2px solid rgba(168,123,46,0.55); border-radius:4px; padding:24px 24px 26px;">
        <div style="font-family:'Bitter',Georgia,serif; font-size:38px; font-weight:700; color:${C.brass}; line-height:1;">${a}</div>
        <div style="margin-top:14px; font-size:17px; font-weight:500; line-height:1.45; color:rgba(245,236,223,0.86);">${b}</div>
      </div>`).join('')}
  </div>

  <div style="position:absolute; left:56px; right:56px; bottom:126px; text-align:center; font-size:19px; font-weight:600; color:rgba(245,236,223,0.62);">
    Two cases presented in SOAP format to the program director for evaluation.
  </div>

  <div style="position:absolute; left:0; right:0; bottom:0; height:96px; background:${C.cream}; padding:0 56px;
              display:flex; align-items:center; justify-content:space-between;">
    <div style="font-size:23px; font-weight:800; color:${C.maroon};">${P.url}</div>
    <div style="font-size:15px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:#7a3a3a;">Begins Sept 16, 2026</div>
  </div>
`
