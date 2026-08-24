// 03 — THE SESSION TITLE. An editorial pull-quote. No hero photo at all: the
// lecture title IS the image. Curiosity does the selling.
import { C } from '../shell.mjs'

export const meta = {
  id: '03-session-title',
  date: 'Monday, August 31',
  angle: 'A real lecture title as the hook',
  bg: C.paper,
  caption: `That is an actual lecture title from this year's programme.

Rob van Wessum — DVM, MS, DACVSMR, Equine All-Sports Medicine Center — on the cases that arrive looking unsalvageable, and what rehabilitation does with them anyway.

It sits alongside three days of talks like it: brachial plexus injuries across human and veterinary patients, TMJ and dental pathologies affecting performance, canine spinal motion, cupping as manual therapy.

October 23–25, Lombard, Illinois, or live from anywhere.

https://healingoasis.edu/conference-2026/attend`,
}

export default `
  <div style="position:absolute; top:0; left:0; width:150px; bottom:0; background:${C.maroon};"></div>
  <div style="position:absolute; top:0; left:150px; width:8px; bottom:0; background:${C.ember};"></div>

  <div style="position:absolute; top:64px; left:0; width:150px; display:flex; justify-content:center;">
    <div style="width:64px; height:64px; border-radius:50%; background:${C.cream}; display:flex; align-items:center; justify-content:center;">
      <img src="../img/logo.png" alt="" style="width:53px; display:block;">
    </div>
  </div>
  <div style="position:absolute; left:0; width:150px; top:190px; display:flex; justify-content:center;">
    <div style="writing-mode:vertical-rl; transform:rotate(180deg); font-size:16px; font-weight:800; letter-spacing:0.32em; text-transform:uppercase; color:rgba(245,236,223,0.86);">2026 Homecoming Conference</div>
  </div>
  <div style="position:absolute; left:0; width:150px; bottom:56px; display:flex; justify-content:center;">
    <div style="writing-mode:vertical-rl; transform:rotate(180deg); font-size:15px; font-weight:700; letter-spacing:0.22em; text-transform:uppercase; color:${C.ember};">Oct 23&ndash;25, 2026</div>
  </div>

  <div style="position:absolute; left:158px; right:0; top:0; bottom:0; padding:96px 70px 0;">
    <div style="font-size:18px; font-weight:800; letter-spacing:0.24em; text-transform:uppercase; color:${C.ember};">One lecture. Of three days.</div>

    <div style="font-family:'Bitter',Georgia,serif; font-size:190px; line-height:0.5; color:rgba(92,1,1,0.16); margin-top:44px; height:96px;">&ldquo;</div>

    <h1 style="font-family:'Bitter',Georgia,serif; font-style:italic; font-weight:700; font-size:82px; line-height:1.04; letter-spacing:-0.022em; color:${C.ink}; margin-top:-6px;">When Unimaginable Pathology &amp; Rehabilitation Meet</h1>

    <div style="margin-top:44px; display:flex; align-items:center; gap:20px;">
      <img src="../img/heads/14_Rob_van_Wessum.jpg" alt="Rob van Wessum" style="width:96px; height:96px; border-radius:50%; object-fit:cover; object-position:50% 26%; border:3px solid ${C.maroon};">
      <div>
        <div style="font-size:27px; font-weight:800; color:${C.ink}; letter-spacing:-0.01em;">Rob van Wessum</div>
        <div style="font-size:17px; font-weight:700; color:${C.maroon}; margin-top:3px;">DVM, MS, DACVSMR (Equine)</div>
        <div style="font-size:16px; font-weight:500; color:${C.muted}; margin-top:2px;">Equine All-Sports Medicine Center &middot; Mason, MI</div>
      </div>
    </div>

    <div style="position:absolute; left:70px; right:70px; top:770px;">
      <div style="font-size:16px; font-weight:800; letter-spacing:0.24em; text-transform:uppercase; color:${C.maroon};">Also on the programme</div>
      <div style="margin-top:18px; display:flex; flex-direction:column;">
        ${[
          ['Brachial Plexus Injuries in Human &amp; Veterinary Patients', 'Stephanie Thomovsky, DVM, MS, DACVIM-Neurology'],
          ['TMJ and Dental Pathologies Affecting Performance', 'Travis Henry, DVM, DAVDC'],
          ['Canine Spinal Motion for Bipeds', 'Julia Tomlinson, BVSc, MS, PhD, DACVS, DACVSMR'],
          ['Hands-On Healing: The Role of Cupping in Veterinary Medicine', 'Amber Ihrke, DVM, CVSMT, DACVSMR'],
        ].map(([t, who], i) => `<div style="padding:15px 0; ${i ? 'border-top:1px solid rgba(92,1,1,0.14);' : ''}">
          <div style="font-family:'Bitter',Georgia,serif; font-style:italic; font-size:27px; font-weight:700; line-height:1.16; color:${C.ink}; letter-spacing:-0.012em;">&ldquo;${t}&rdquo;</div>
          <div style="font-size:15px; font-weight:600; color:${C.muted}; margin-top:5px;">${who}</div>
        </div>`).join('')}
      </div>
    </div>

    <div style="position:absolute; left:70px; right:70px; bottom:58px;">
      <div style="height:2px; background:rgba(92,1,1,0.18);"></div>
      <p style="margin-top:20px; font-size:19px; line-height:1.5; font-weight:500; color:${C.muted};">Sixteen speakers &middot; up to 20 CE contact hours &middot; Lombard, Illinois, or live-streamed to wherever you are.</p>
      <div style="margin-top:16px; font-size:22px; font-weight:800; color:${C.maroon};">healingoasis.edu/conference-2026/attend</div>
    </div>
  </div>
`
