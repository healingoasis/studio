// 02 — THE FACULTY WALL. All sixteen faces, every one named under their photo.
// Built to be shared BY the speakers, which is how a post like this travels.
import { C } from '../shell.mjs'

const FACULTY = [
  ['01_Sabrina_Brounts',    'Sabrina Brounts',    'Equine surgery · Wisconsin'],
  ['02_Matt_Durham',        'Matt Durham',        'Sports medicine'],
  ['03_Marthina_Greer',     'Marthina Greer',     'DVM, JD'],
  ['04_Travis_Henry',       'Travis Henry',       'Dentistry'],
  ['05_Amber_Ihrke',        'Amber Ihrke',        'Rehab · Healing Oasis'],
  ['06_Jessica_Linder',     'Jessica Linder',     'Neurology · Purdue'],
  ['07_Rosemary_LoGiudice', 'Rosemary LoGiudice', 'Rehab · Healing Oasis'],
  ['08_Brittany_Ludwig',    'Brittany Ludwig',    'Sports medicine'],
  ['09_Coralie_Morauw',     'Coralie Morauw',     'Equine'],
  ['10_John_Nielsen',       'John Nielsen',       'CVT, VTS-ECC'],
  ['11_Angela_Polmateer',   'Angela Polmateer',   'OTR, CHT'],
  ['12_Stephanie_Thomovsky','Stephanie Thomovsky','Neurology · Purdue'],
  ['13_Julia_Tomlinson',    'Julia Tomlinson',    'Canine rehab'],
  ['14_Rob_van_Wessum',     'Rob van Wessum',     'Equine sports medicine'],
  ['15_Rachel_Yoquelet',    'Rachel Yoquelet',    'Rehabilitation · Purdue'],
  ['16_Pedro_Luis_Rivera',  'Pedro Luis Rivera',  'Program Director'],
]

// One speaker has no photograph on file — her tile gets initials rather than
// the orange placeholder logo, so the wall stays on-brand.
const NO_PHOTO = { '11_Angela_Polmateer': 'AP' }

const tile = ([file, name, note]) => `
    <div style="display:flex; flex-direction:column;">
      <div style="position:relative; width:100%; height:172px; overflow:hidden; background:${C.deep};">
        ${NO_PHOTO[file]
          ? `<div style="width:100%; height:100%; background:${C.maroon}; display:flex; align-items:center; justify-content:center;">
               <span style="font-family:'Bitter',Georgia,serif; font-size:62px; font-weight:700; color:rgba(245,236,223,0.92); letter-spacing:0.02em;">${NO_PHOTO[file]}</span>
             </div>`
          : `<img src="../img/heads/${file}.jpg" alt="${name}" style="width:100%; height:100%; object-fit:cover; object-position:50% 28%; display:block; filter:saturate(0.88) contrast(1.03);">`}
      </div>
      <div style="padding:8px 4px 0;">
        <div style="font-size:14px; font-weight:800; color:${C.ink}; line-height:1.15; letter-spacing:-0.005em;">${name}</div>
        <div style="font-size:11px; font-weight:600; color:${C.muted}; line-height:1.25; margin-top:2px;">${note}</div>
      </div>
    </div>`

export const meta = {
  id: '02-faculty-wall',
  date: 'Friday, August 28',
  angle: 'The faculty — sixteen names',
  bg: C.paper,
  caption: `This is the room.

Sixteen board-certified veterinarians, specialists and senior educators. Equine surgery from Wisconsin. Veterinary neurology from Purdue. Dentistry, rehabilitation, sports medicine, occupational therapy — and our own senior faculty.

October 23–25, Lombard, Illinois. Or live-streamed to wherever you are.

Tag someone who belongs in this picture.

https://healingoasis.edu/conference-2026/attend`,
}

export default `
  <div style="position:absolute; top:0; left:0; right:0; height:128px; background:${C.maroon};
              display:flex; align-items:center; justify-content:space-between; padding:0 52px;">
    <div style="display:flex; align-items:center; gap:15px;">
      <div style="width:50px; height:50px; border-radius:50%; background:${C.cream}; display:flex; align-items:center; justify-content:center;">
        <img src="../img/logo.png" alt="" style="width:42px; display:block;">
      </div>
      <div>
        <div style="font-size:17px; font-weight:800; letter-spacing:0.22em; text-transform:uppercase; color:#fff;">2026 Homecoming Conference</div>
        <div style="font-size:14px; font-weight:600; letter-spacing:0.15em; text-transform:uppercase; color:rgba(245,236,223,0.72); margin-top:3px;">Resilience in Motion</div>
      </div>
    </div>
    <div style="text-align:right; font-size:14px; font-weight:700; letter-spacing:0.13em; text-transform:uppercase; line-height:1.5; color:rgba(245,236,223,0.86);">Oct 23&ndash;25, 2026<br>Lombard, Illinois</div>
  </div>

  <div style="position:absolute; top:128px; left:0; right:0; bottom:306px; padding:26px 52px 0;">
    <div style="display:grid; grid-template-columns:repeat(4, minmax(0,1fr)); gap:16px 22px;">
      ${FACULTY.map(tile).join('')}
    </div>
  </div>

  <div style="position:absolute; left:0; right:0; bottom:74px; height:226px; background:${C.paper};
              border-top:3px solid ${C.ember}; padding:28px 52px 0;">
    <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:36px;">
      <div>
        <h1 style="font-family:'Bitter',Georgia,serif; font-weight:700; font-size:60px; line-height:0.96; letter-spacing:-0.028em; color:${C.ink};">Sixteen people<br>worth the drive</h1>
        <p style="margin-top:12px; font-size:18px; line-height:1.4; font-weight:500; color:${C.muted}; max-width:640px;">Board-certified veterinarians, specialists and senior educators &mdash; three days of rehabilitation, sports medicine and manual therapy.</p>
      </div>
      <div style="text-align:right; flex-shrink:0;">
        <div style="font-family:'Bitter',Georgia,serif; font-size:64px; font-weight:900; line-height:0.9; color:${C.maroon};">16</div>
        <div style="font-size:14px; font-weight:800; letter-spacing:0.17em; text-transform:uppercase; color:${C.muted}; margin-top:6px;">speakers</div>
      </div>
    </div>
  </div>

  <div style="position:absolute; left:0; right:0; bottom:0; height:74px; background:${C.maroon}; padding:0 52px;
              display:flex; align-items:center; justify-content:space-between;">
    <div style="font-size:21px; font-weight:800; color:#fff;">healingoasis.edu/conference-2026/attend</div>
    <div style="font-size:16px; font-weight:700; letter-spacing:0.10em; text-transform:uppercase; color:rgba(245,236,223,0.78);">Registration closes Oct 12</div>
  </div>
`
