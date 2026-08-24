// 07 — THE HANDS. One photograph, almost no type. After six posts of
// information, the quiet tactile one is the one that stops a thumb.
import { C, P } from '../shell.mjs'

export const meta = {
  id: '07-the-hands',
  date: 'Monday, September 7',
  angle: 'Hands-on — the thing you cannot learn from a book',
  bg: C.night,
  caption: `You cannot learn this from a book, and we do not ask you to.

Extensive hands-on clinical practicums, with the ratio held to three or four students per faculty member. Twenty students maximum in the class. No required additional externships — the practicum is inside the programme, not bolted on after it.

Two face-to-face modules in Sturtevant, Wisconsin. Those are the long days.

healingoasis.edu/acupuncture`,
}

export default `
  <img src="../img/hands-dog.jpg" alt="" style="position:absolute; inset:0; width:1080px; height:1350px; object-fit:cover; object-position:52% 46%;">
  <div style="position:absolute; inset:0; background:
      linear-gradient(180deg, rgba(26,8,8,0.58) 0%, rgba(26,8,8,0.06) 26%, rgba(26,8,8,0.10) 46%, rgba(26,8,8,0.82) 76%, ${C.night} 100%);"></div>

  <div style="position:absolute; top:54px; left:0; right:0; text-align:center;">
    <div style="display:inline-flex; align-items:center; gap:14px;">
      <div style="width:44px; height:44px; border-radius:50%; background:${C.cream}; display:flex; align-items:center; justify-content:center;">
        <img src="../img/logo.png" alt="" style="width:37px; display:block;">
      </div>
      <div style="font-size:15px; font-weight:800; letter-spacing:0.28em; text-transform:uppercase; color:rgba(245,236,223,0.92);">Veterinary Acupuncture</div>
    </div>
  </div>

  <div style="position:absolute; left:70px; right:70px; bottom:224px;">
    <div style="width:70px; height:4px; background:${C.brass};"></div>
    <h1 style="margin-top:30px; font-family:'Bitter',Georgia,serif; font-weight:700; font-size:96px; line-height:0.94; letter-spacing:-0.04em; color:#fff;">You cannot learn<br>this from a book.</h1>
    <p style="margin-top:26px; font-size:24px; line-height:1.5; font-weight:500; color:rgba(245,236,223,0.82); max-width:800px;">So we do not ask you to. Extensive hands-on clinical practicums, three or four students to one faculty member, twenty in the class at most.</p>
  </div>

  <div style="position:absolute; left:70px; right:70px; bottom:120px; padding-top:24px; border-top:2px solid rgba(245,236,223,0.26);
              display:flex; align-items:baseline; justify-content:space-between; gap:24px;">
    <div style="font-size:20px; font-weight:700; color:rgba(245,236,223,0.80);">Two face-to-face modules in ${P.place}</div>
    <div style="font-size:18px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:${C.brass}; white-space:nowrap;">No externships required</div>
  </div>

  <div style="position:absolute; left:0; right:0; bottom:0; height:96px; background:${C.cream}; padding:0 70px;
              display:flex; align-items:center; justify-content:center;">
    <div style="font-size:25px; font-weight:800; color:${C.maroon};">${P.url}</div>
  </div>
`
