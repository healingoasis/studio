// 07 — EQUINE. The pair to 06, deliberately inverted: stacked bands rather
// than a struck-through bar, dark type on cream, the word set on its own field.
import { C } from '../shell.mjs'

export const meta = {
  id: '07-saturday-equine',
  date: 'Saturday, September 12',
  angle: 'Saturday tracks — equine',
  bg: C.paper,
  caption: `The other half of Saturday.

The equine track, for the people whose patients weigh half a ton. Sports medicine, rehabilitation and manual therapy for the horse — taught by clinicians who do it for a living, including large animal surgery from Wisconsin and equine sports medicine from Michigan.

"When Unimaginable Pathology & Rehabilitation Meet" is on this track.

You choose your track when you register.

https://healingoasis.edu/conference-2026/attend`,
}

export default `
  <div style="position:absolute; top:0; left:0; right:0; height:104px; background:${C.maroon};
              display:flex; align-items:center; justify-content:space-between; padding:0 52px;">
    <div style="display:flex; align-items:center; gap:14px;">
      <div style="width:48px; height:48px; border-radius:50%; background:${C.cream}; display:flex; align-items:center; justify-content:center;">
        <img src="../img/logo.png" alt="" style="width:40px; display:block;">
      </div>
      <div style="font-size:16px; font-weight:800; letter-spacing:0.22em; text-transform:uppercase; color:#fff;">2026 Homecoming Conference</div>
    </div>
    <div style="font-size:14px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; color:rgba(245,236,223,0.84);">Oct 23&ndash;25 &middot; Lombard, IL</div>
  </div>

  <div style="position:absolute; top:104px; left:0; right:0; height:430px; overflow:hidden;">
    <img src="../img/equine2.jpg" alt="" style="width:1080px; height:430px; object-fit:cover; object-position:50% 46%; display:block;">
  </div>

  <div style="position:absolute; top:534px; left:0; right:0; height:300px; background:${C.paper};
              display:flex; flex-direction:column; align-items:center; justify-content:center;">
    <div style="display:flex; align-items:center; gap:18px;">
      <div style="height:3px; width:56px; background:${C.ember};"></div>
      <div style="font-size:19px; font-weight:800; letter-spacing:0.28em; text-transform:uppercase; color:${C.ember};">Saturday, you choose</div>
      <div style="height:3px; width:56px; background:${C.ember};"></div>
    </div>
    <h1 style="font-family:'Bitter',Georgia,serif; font-weight:900; font-size:196px; line-height:0.86; letter-spacing:-0.05em; color:${C.ink}; margin-top:8px;">Equine</h1>
  </div>

  <div style="position:absolute; top:834px; left:0; right:0; bottom:96px; background:${C.maroon}; padding:44px 52px 0;">
    <p style="font-size:26px; line-height:1.42; font-weight:500; color:rgba(245,236,223,0.92); max-width:940px;">Sports medicine, rehabilitation and manual therapy for the horse &mdash; taught by clinicians who do it for a living.</p>
    <div style="margin-top:30px; display:grid; grid-template-columns:repeat(2, minmax(0,1fr)); gap:16px;">
      ${[
        ['&ldquo;When Unimaginable Pathology &amp; Rehabilitation Meet&rdquo;', 'Rob van Wessum, DVM, MS, DACVSMR'],
        ['&ldquo;TMJ and Dental Pathologies Affecting Performance&rdquo;', 'Travis Henry, DVM, DAVDC'],
      ].map(([t, w]) => `<div style="border-left:3px solid ${C.ember}; padding:2px 0 2px 16px;">
        <div style="font-family:'Bitter',Georgia,serif; font-style:italic; font-size:22px; font-weight:700; line-height:1.2; color:#fff;">${t}</div>
        <div style="font-size:15px; font-weight:600; color:rgba(245,236,223,0.72); margin-top:6px;">${w}</div>
      </div>`).join('')}
    </div>
    <div style="margin-top:32px; font-size:20px; font-weight:600; color:rgba(245,236,223,0.78);">Saturday splits into a canine track and an equine track. You pick yours at the checkout.</div>
  </div>

  <div style="position:absolute; left:0; right:0; bottom:0; height:96px; background:${C.cream}; padding:0 52px;
              display:flex; align-items:center; justify-content:space-between;">
    <div style="font-size:22px; font-weight:800; color:${C.maroon};">healingoasis.edu/conference-2026/attend</div>
    <div style="font-size:16px; font-weight:700; letter-spacing:0.10em; text-transform:uppercase; color:#7a3a3a;">Registration closes Oct 12</div>
  </div>
`
