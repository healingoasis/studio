// 05 — THE SPLIT. One decision, drawn as a decision: the frame cut straight
// down the middle, each half arguing its own case.
import { C } from '../shell.mjs'

export const meta = {
  id: '05-the-split',
  date: 'Sunday, September 6',
  angle: 'Two ways to attend',
  bg: C.paper,
  caption: `There are two ways to do this, and you pick at the checkout.

IN THE ROOM — three days on campus in Lombard. The lectures, the exhibit hall, the hands-on sessions, and the corridor conversations that never make the schedule.

ON THE STREAM — the lectures live from wherever you are, the same CE credit eligibility, and the recordings afterward so a Saturday emergency does not cost you the session.

Nobody misses this one over a plane ticket.

https://healingoasis.edu/conference-2026/attend`,
}

const half = ({ img, tone, kicker, title, lines, note }) => {
  const dark = tone === 'dark'
  return `
    <div style="position:relative; height:100%; overflow:hidden; background:${dark ? C.maroon : C.paper};
                display:flex; flex-direction:column;">
      <div style="position:relative; height:430px; overflow:hidden; flex-shrink:0;">
        <img src="../img/${img}" alt="" style="width:100%; height:430px; object-fit:cover; display:block;">
        <div style="position:absolute; inset:0; background:linear-gradient(180deg, rgba(20,3,3,0.30) 0%, rgba(20,3,3,0.00) 40%, ${dark ? 'rgba(92,1,1,0.86)' : 'rgba(250,246,239,0.88)'} 88%, ${dark ? C.maroon : C.paper} 100%);"></div>
      </div>
      <div style="padding:6px 44px 40px; flex-grow:1; display:flex; flex-direction:column; justify-content:space-between;">
        <div>
        <div style="font-size:16px; font-weight:800; letter-spacing:0.26em; text-transform:uppercase; color:${dark ? 'rgba(245,236,223,0.70)' : C.ember};">${kicker}</div>
        <h2 style="font-family:'Bitter',Georgia,serif; font-weight:700; font-size:66px; line-height:0.94; letter-spacing:-0.03em; color:${dark ? '#fff' : C.ink}; margin-top:12px;">${title}</h2>
        <div style="margin-top:26px; height:2px; background:${dark ? 'rgba(245,236,223,0.28)' : 'rgba(92,1,1,0.18)'};"></div>
        <div style="margin-top:22px; display:flex; flex-direction:column; gap:18px;">
          ${lines.map(l => `<div style="font-size:21px; line-height:1.34; font-weight:600; color:${dark ? 'rgba(245,236,223,0.92)' : C.ink};">${l}</div>`).join('')}
        </div>
        </div>
        <div style="font-size:17px; line-height:1.45; font-weight:500; color:${dark ? 'rgba(245,236,223,0.66)' : C.muted}; border-top:2px solid ${dark ? 'rgba(245,236,223,0.24)' : 'rgba(92,1,1,0.16)'}; padding-top:18px;">${note}</div>
      </div>
    </div>`
}

export default `
  <div style="position:absolute; top:0; left:0; right:0; height:104px; background:${C.deep}; z-index:2;
              display:flex; align-items:center; justify-content:space-between; padding:0 46px;">
    <div style="display:flex; align-items:center; gap:14px;">
      <div style="width:46px; height:46px; border-radius:50%; background:${C.cream}; display:flex; align-items:center; justify-content:center;">
        <img src="../img/logo.png" alt="" style="width:39px; display:block;">
      </div>
      <div style="font-size:16px; font-weight:800; letter-spacing:0.22em; text-transform:uppercase; color:#fff;">2026 Homecoming Conference</div>
    </div>
    <div style="font-size:14px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; color:rgba(245,236,223,0.82);">Oct 23&ndash;25 &middot; Lombard, IL</div>
  </div>

  <div style="position:absolute; top:104px; left:0; right:0; bottom:96px; display:grid; grid-template-columns:1fr 1fr;">
    ${half({
      img: 'split-a.jpg', tone: 'dark', kicker: 'Face-to-face',
      title: 'In the<br>room',
      lines: ['Three days on campus in Lombard', 'Lectures, exhibit hall, hands-on sessions', 'The corridor conversations'],
      note: 'National University of Health Sciences, 200 E. Roosevelt Rd.',
    })}
    ${half({
      img: 'split-b.jpg', tone: 'light', kicker: 'Live streaming',
      title: 'On the<br>stream',
      lines: ['The lectures live, from anywhere', 'The same CE credit eligibility', 'Recordings to watch afterward'],
      note: 'Choose your format at checkout. It costs the same either way.',
    })}
  </div>

  <div style="position:absolute; top:104px; bottom:96px; left:50%; width:4px; margin-left:-2px; background:${C.ember}; z-index:3;"></div>

  <div style="position:absolute; left:0; right:0; bottom:0; height:96px; background:${C.deep}; padding:0 46px;
              display:flex; align-items:center; justify-content:space-between;">
    <div style="font-size:22px; font-weight:800; color:#fff;">healingoasis.edu/conference-2026/attend</div>
    <div style="font-size:16px; font-weight:700; letter-spacing:0.10em; text-transform:uppercase; color:rgba(245,236,223,0.76);">Registration closes Oct 12</div>
  </div>
`
