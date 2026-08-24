// 10 — THE TRIPTYCH. Three photo bands, three sentences. The only post that
// tries to show the shape of a day rather than argue a point.
import { C } from '../shell.mjs'

export const meta = {
  id: '10-three-days',
  date: 'Monday, September 21',
  angle: 'What three days actually look like',
  bg: C.deep,
  caption: `What actually happens over three days.

You sit in lectures given by people who wrote the papers. You put your hands on a patient with a specialist standing next to you. You walk an exhibit hall and find the thing you did not know existed.

And somewhere between all of it, you describe the case that has been bothering you for eight months to someone who has seen it before.

That last part is why people come back.

October 23–25, Lombard, Illinois — or live from anywhere.
https://healingoasis.edu/conference-2026/attend`,
}

const band = ({ img, pos, n, title, text }) => `
  <div style="position:relative; height:340px; overflow:hidden;">
    <img src="../img/${img}" alt="" style="width:1080px; height:340px; object-fit:cover; object-position:${pos}; display:block;">
    <div style="position:absolute; inset:0; background:linear-gradient(90deg, rgba(20,3,3,0.90) 0%, rgba(20,3,3,0.72) 42%, rgba(20,3,3,0.18) 100%);"></div>
    <div style="position:absolute; inset:0; padding:0 54px; display:flex; align-items:center; gap:26px;">
      <div style="font-family:'Bitter',Georgia,serif; font-size:96px; font-weight:900; line-height:1; color:${C.ember}; flex-shrink:0;">${n}</div>
      <div style="max-width:640px;">
        <div style="font-family:'Bitter',Georgia,serif; font-size:44px; font-weight:700; line-height:1.02; letter-spacing:-0.025em; color:#fff;">${title}</div>
        <div style="margin-top:10px; font-size:19px; line-height:1.42; font-weight:500; color:rgba(245,236,223,0.82);">${text}</div>
      </div>
    </div>
  </div>`

export default `
  <div style="position:absolute; top:0; left:0; right:0; height:150px; background:${C.deep}; padding:0 54px;
              display:flex; flex-direction:column; justify-content:center;">
    <div style="display:flex; align-items:center; justify-content:space-between;">
      <div style="display:flex; align-items:center; gap:14px;">
        <div style="width:46px; height:46px; border-radius:50%; background:${C.cream}; display:flex; align-items:center; justify-content:center;">
          <img src="../img/logo.png" alt="" style="width:39px; display:block;">
        </div>
        <div style="font-size:16px; font-weight:800; letter-spacing:0.22em; text-transform:uppercase; color:#fff;">2026 Homecoming Conference</div>
      </div>
      <div style="font-size:14px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; color:rgba(245,236,223,0.80);">Oct 23&ndash;25 &middot; Lombard, IL</div>
    </div>
    <h1 style="font-family:'Bitter',Georgia,serif; font-size:52px; font-weight:700; line-height:1; letter-spacing:-0.03em; color:#fff; margin-top:18px;">Three days, roughly</h1>
  </div>

  <div style="position:absolute; top:150px; left:0; right:0;">
    ${band({ img: 'num.jpg', pos: '50% 34%', n: '1', title: 'You sit and listen',
             text: 'Sixteen speakers across sports medicine, rehabilitation, neurology and dentistry.' })}
    ${band({ img: 'canine.jpg', pos: '50% 30%', n: '2', title: 'You put your hands on it',
             text: 'Hands-on sessions, with the person who wrote the lecture standing next to you.' })}
    ${band({ img: 'room.jpg', pos: '50% 46%', n: '3', title: 'You talk in the corridor',
             text: 'And describe the case that has bothered you for months to someone who has seen it.' })}
  </div>

  <div style="position:absolute; left:0; right:0; bottom:0; height:180px; background:${C.cream}; padding:0 54px;
              display:flex; align-items:center; justify-content:space-between; gap:30px;">
    <div>
      <div style="font-family:'Bitter',Georgia,serif; font-size:38px; font-weight:700; color:${C.ink}; line-height:1.05; letter-spacing:-0.02em;">The third one is<br>why people come back.</div>
      <div style="margin-top:14px; font-size:21px; font-weight:800; color:${C.maroon};">healingoasis.edu/conference-2026/attend</div>
    </div>
    <div style="text-align:right; flex-shrink:0; font-size:15px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:${C.muted}; line-height:1.6;">Registration<br>closes Oct 12</div>
  </div>
`
