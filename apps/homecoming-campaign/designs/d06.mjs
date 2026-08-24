// 06 — CANINE. A title card: photo edge to edge, one cream bar struck through
// the middle of it. Half of a matched pair with 07.
import { C } from '../shell.mjs'

export const meta = {
  id: '06-saturday-canine',
  date: 'Wednesday, September 9',
  angle: 'Saturday tracks — canine',
  bg: C.deep,
  caption: `Saturday is the day the conference splits in two.

The canine track is for the people whose whole week is dogs. Canine spinal motion. Brachial plexus injuries. Shoulder, elbow and carpal injuries — diagnosis, therapeutic plan, and the return to function. The cases that do not resolve the way the textbook says they will.

You choose your track when you register.

https://healingoasis.edu/conference-2026/attend`,
}

export default `
  <img src="../img/canine.jpg" alt="" style="position:absolute; inset:0; width:1080px; height:1350px; object-fit:cover;">
  <div style="position:absolute; inset:0; background:linear-gradient(180deg, rgba(20,3,3,0.70) 0%, rgba(20,3,3,0.10) 22%, rgba(20,3,3,0.00) 46%, rgba(20,3,3,0.34) 76%, rgba(20,3,3,0.88) 100%);"></div>

  <div style="position:absolute; top:44px; left:52px; right:52px; display:flex; align-items:center; justify-content:space-between;">
    <div style="display:flex; align-items:center; gap:14px;">
      <div style="width:48px; height:48px; border-radius:50%; background:${C.cream}; display:flex; align-items:center; justify-content:center;">
        <img src="../img/logo.png" alt="" style="width:40px; display:block;">
      </div>
      <div style="font-size:16px; font-weight:800; letter-spacing:0.22em; text-transform:uppercase; color:#fff;">2026 Homecoming Conference</div>
    </div>
    <div style="font-size:14px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; color:rgba(245,236,223,0.84);">Oct 23&ndash;25 &middot; Lombard, IL</div>
  </div>

  <div style="position:absolute; left:0; right:0; top:520px; background:${C.cream}; padding:34px 52px 38px;
              box-shadow:0 26px 60px rgba(20,3,3,0.40);">
    <div style="display:flex; align-items:center; gap:18px;">
      <div style="height:3px; width:56px; background:${C.ember};"></div>
      <div style="font-size:19px; font-weight:800; letter-spacing:0.28em; text-transform:uppercase; color:${C.ember};">Saturday, you choose</div>
    </div>
    <h1 style="font-family:'Bitter',Georgia,serif; font-weight:900; font-size:190px; line-height:0.82; letter-spacing:-0.05em; color:${C.maroon}; margin-top:14px;">Canine</h1>
    <p style="margin-top:22px; font-size:23px; line-height:1.42; font-weight:500; color:${C.ink}; max-width:880px;">Spinal motion. Brachial plexus injuries. Shoulder, elbow and carpal work &mdash; diagnosis, therapeutic plan, and the return to function.</p>
  </div>

  <div style="position:absolute; left:52px; right:52px; bottom:44px;">
    <div style="height:2px; background:rgba(245,236,223,0.30);"></div>
    <div style="margin-top:22px; display:flex; align-items:flex-end; justify-content:space-between; gap:24px;">
      <div>
        <div style="font-size:21px; font-weight:700; color:rgba(245,236,223,0.86); line-height:1.4;">Saturday splits into a canine track and an equine track.<br>You pick yours at the checkout.</div>
        <div style="margin-top:16px; font-size:22px; font-weight:800; color:#fff;">healingoasis.edu/conference-2026/attend</div>
      </div>
      <div style="text-align:right; flex-shrink:0; font-size:15px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:rgba(245,236,223,0.70); line-height:1.5;">Registration<br>closes Oct 12</div>
    </div>
  </div>
`
