// Eight carousels, six slides each — 48 images for the 2026 Homecoming
// Conference, in the format the research says travels. Every fact from
// healingoasis.edu/conference-2026/attend, checked 2026-08-24; lecture titles
// from the school's own speaker cards in the 2026 Drive folder.
import { C } from './kit.mjs'

const veilDark = 'linear-gradient(180deg,rgba(18,6,6,0.74) 0%,rgba(18,6,6,0.28) 34%,rgba(18,6,6,0.55) 66%,rgba(18,6,6,0.92) 100%)'
const veilSoft = 'linear-gradient(180deg,rgba(18,6,6,0.62) 0%,rgba(18,6,6,0.14) 40%,rgba(18,6,6,0.80) 100%)'

const TH = {
  maroon:  { bg: C.maroon,  ink: '#fff',  sub: 'rgba(245,236,223,0.86)', accent: C.brass, tone: 'light', rule: 'rgba(245,236,223,0.26)', veil: veilSoft, accentOn: '#ffd9a0' },
  paper:   { bg: C.paper,   ink: C.ink,   sub: C.muted,                  accent: C.maroon,tone: 'dark',  rule: 'rgba(92,1,1,0.16)',      veil: veilSoft, accentOn: '#ffd9a0' },
  night:   { bg: C.night,   ink: '#fff',  sub: 'rgba(245,236,223,0.78)', accent: C.brass, tone: 'light', rule: 'rgba(245,236,223,0.22)', veil: veilDark, accentOn: '#ffd9a0' },
  bone:    { bg: '#f3efe6', ink: '#1f1412',sub: '#6b5550',               accent: C.maroon,tone: 'dark',  rule: 'rgba(31,20,18,0.14)',    veil: veilSoft, accentOn: '#ffd9a0' },
  oxblood: { bg: '#400202', ink: C.cream, sub: 'rgba(245,236,223,0.80)', accent: '#e2b48a',tone:'light', rule: 'rgba(245,236,223,0.22)', veil: veilDark, accentOn: '#ffd9a0', ctaInk: '#400202' },
  sand:    { bg: '#e9dcc6', ink: '#2a1512',sub: '#6b5550',               accent: C.maroon,tone: 'dark',  rule: 'rgba(92,1,1,0.18)',      veil: veilSoft, accentOn: '#ffd9a0' },
  inkwell: { bg: '#14100e', ink: '#fff',  sub: 'rgba(255,255,255,0.74)', accent: C.brass, tone: 'light', rule: 'rgba(255,255,255,0.18)', veil: veilDark, accentOn: '#ffd9a0' },
  clay:    { bg: '#7a3320', ink: '#fff',  sub: 'rgba(255,244,232,0.86)', accent: '#f0dcc0',tone:'light', rule: 'rgba(255,255,255,0.24)', veil: veilSoft, accentOn: '#ffd9a0', ctaInk: '#7a3320' },
}

const head = (f) => `heads/${f}.jpg`


// Each of these is used exactly once. Order sets which slides get one.
export const POOL = [
  'inv.jpg',
  'c-faculty-a.jpg',
  'c-award.jpg',
  'c-registration.jpg',
  'c-gesture.jpg',
  'c-lecture-a.jpg',
  'c-lecture-b.jpg',
  'c-lecture-c.jpg',
  'c-lecture-d.jpg',
  'c-lecture-e.jpg',
  'c-lecture-f.jpg',
  'c-whiteboard.jpg',
  'c-model.jpg',
  'c-podium.jpg',
  'c-suit.jpg',
  'split-a.jpg',
  'split-b.jpg',
  'room.jpg',
  'num.jpg',
  'canine.jpg',
  'equine2.jpg',
  'c-handling.jpg',
  'c-couple-dobie.jpg',
  'c-frenchie.jpg',
  'c-exhibit.jpg',
  'c-equipment.jpg',
  'last.jpg',
  'ticket.jpg',
  'hero-welcome.jpg',
]

export const CAROUSELS = [
  {
    id: 'F01_homecoming', th: TH.night, date: 'Tuesday, August 25',
    angle: 'The invitation — registration is open',
    caption: `Homecoming.

The 2026 Healing Oasis Conference — Resilience in Motion: Comparative Rehabilitation & Manual Therapies for All Beings.

October 23–25, National University of Health Sciences, Lombard, Illinois. Or live-streamed to wherever you are, for the same CE credit.

Sixteen speakers. Up to 20 CE contact hours. Registration closes October 12.
https://healingoasis.edu/conference-2026/attend`,
    slides: [
      { kind: 'hook', img: 'inv.jpg', pos: '50% 30%', big: 'Homecoming', sub: 'October 23–25, 2026 · Lombard, Illinois', size: 132 },
      { kind: 'lead', kicker: 'This year&rsquo;s theme', big: 'Resilience<br>in Motion', sub: 'Comparative Rehabilitation &amp; Manual Therapies for All Beings.' },
      { kind: 'stat', num: '3', unit: 'days', sub: 'Friday to Sunday, at National University of Health Sciences.' },
      { kind: 'stat', num: '16', unit: 'speakers', sub: 'Board-certified veterinarians, specialists and senior educators.' },
      { kind: 'stat', num: '20', unit: 'CE hours', sub: 'The maximum across the three days. The live stream earns the same.' },
      { kind: 'cta', big: 'Be in the room.<br>Or be there anyway.', sub: 'Registration closes October 12, 2026.' },
    ],
  },
  {
    id: 'F02_the-room', th: TH.paper, date: 'Friday, August 28',
    angle: 'The faculty — sixteen names, four to a slide',
    caption: `This is the room.

Sixteen board-certified veterinarians, specialists and senior educators — equine surgery from Wisconsin, veterinary neurology from Purdue, dentistry, rehabilitation, sports medicine, occupational therapy, and our own senior faculty.

Tag someone who belongs in this picture.

October 23–25, Lombard, Illinois, or live from anywhere.
https://healingoasis.edu/conference-2026/attend`,
    slides: [
      { kind: 'hook', num: '16', big: 'people worth<br>the drive', sub: 'Swipe and see who is teaching this year.' },
      { kind: 'quad', kicker: 'Equine &amp; surgery', people: [
        ['01_Sabrina_Brounts', 'Sabrina Brounts', 'Equine surgery · Wisconsin'],
        ['14_Rob_van_Wessum', 'Rob van Wessum', 'Equine sports medicine'],
        ['09_Coralie_Morauw', 'Coralie Morauw', 'Equine'],
        ['02_Matt_Durham', 'Matt Durham', 'Sports medicine'],
      ] },
      { kind: 'quad', kicker: 'Neurology &amp; rehabilitation', people: [
        ['12_Stephanie_Thomovsky', 'Stephanie Thomovsky', 'Neurology · Purdue'],
        ['06_Jessica_Linder', 'Jessica Linder', 'Neurology · Purdue'],
        ['13_Julia_Tomlinson', 'Julia Tomlinson', 'Canine rehab'],
        ['15_Rachel_Yoquelet', 'Rachel Yoquelet', 'Rehabilitation · Purdue'],
      ] },
      { kind: 'quad', kicker: 'Dentistry, therapy &amp; law', people: [
        ['04_Travis_Henry', 'Travis Henry', 'Dentistry'],
        ['11_Angela_Polmateer', 'Angela Polmateer', 'OTR, CHT'],
        ['03_Marthina_Greer', 'Marthina Greer', 'DVM, JD'],
        ['10_John_Nielsen', 'John Nielsen', 'CVT, VTS-ECC'],
      ] },
      { kind: 'quad', kicker: 'And our own', people: [
        ['05_Amber_Ihrke', 'Amber Ihrke', 'Rehab · Healing Oasis'],
        ['07_Rosemary_LoGiudice', 'Rosemary LoGiudice', 'Rehab · Healing Oasis'],
        ['08_Brittany_Ludwig', 'Brittany Ludwig', 'Sports medicine'],
        ['16_Pedro_Luis_Rivera', 'Pedro Luis Rivera', 'Program Director'],
      ] },
      { kind: 'cta', big: 'Sixteen reasons<br>to make the drive.', sub: 'October 23–25, Lombard, Illinois.' },
    ],
  },
  {
    id: 'F03_the-lectures', th: TH.bone, date: 'Monday, August 31',
    angle: 'Real lecture titles as the hook',
    caption: `These are actual lecture titles from this year's program.

"When Unimaginable Pathology & Rehabilitation Meet" — Rob van Wessum, DVM, MS, DACVSMR
"Brachial Plexus Injuries in Human & Veterinary Patients" — Stephanie Thomovsky, DVM, MS, DACVIM-Neurology
"TMJ and Dental Pathologies Affecting Performance" — Travis Henry, DVM, DAVDC
"Canine Spinal Motion for Bipeds" — Julia Tomlinson, BVSc, MS, PhD, DACVS, DACVSMR
"Hands-On Healing: The Role of Cupping in Veterinary Medicine" — Amber Ihrke, DVM, CVSMT, DACVSMR

Three days of talks like these.
https://healingoasis.edu/conference-2026/attend`,
    slides: [
      { kind: 'hook', big: 'Five real<br>lecture titles.', sub: 'Not a summary. The actual program.', size: 116 },
      { kind: 'quote', text: 'When Unimaginable Pathology &amp; Rehabilitation Meet', who: 'Rob van Wessum', cred: 'DVM, MS, DACVSMR (Equine)', face: head('14_Rob_van_Wessum') },
      { kind: 'quote', text: 'Brachial Plexus Injuries in Human &amp; Veterinary Patients', who: 'Stephanie Thomovsky', cred: 'DVM, MS, DACVIM-Neurology', face: head('12_Stephanie_Thomovsky') },
      { kind: 'quote', text: 'TMJ and Dental Pathologies Affecting Performance', who: 'Travis Henry', cred: 'DVM, DAVDC', face: head('04_Travis_Henry') },
      { kind: 'quote', text: 'Hands-On Healing: The Role of Cupping in Veterinary Medicine', who: 'Amber Ihrke', cred: 'DVM, CVSMT, DACVSMR', face: head('05_Amber_Ihrke') },
      { kind: 'cta', big: 'Three days<br>of these.', sub: 'Sixteen speakers, October 23–25.' },
    ],
  },
  {
    id: 'F04_two-ways', th: TH.oxblood, date: 'Monday, September 7',
    angle: 'In the room, or on the stream',
    caption: `Two ways to do this conference, and you pick at checkout.

FACE-TO-FACE — three days on campus in Lombard, with full access to the lectures, the exhibit hall, the hands-on sessions and everyone else who showed up.

LIVE STREAMING — join the lectures live from wherever you are, with the same CE credit eligibility, and the recordings afterward.

Nobody misses this one over a plane ticket.
https://healingoasis.edu/conference-2026/attend`,
    slides: [
      { kind: 'hook', num: '2', big: 'ways in.<br>Same credit.', sub: 'You choose your format at checkout.' },
      { kind: 'photo', img: 'split-a.jpg', pos: '50% 30%', kicker: 'One', big: 'In the room', sub: 'Three days on campus. Lectures, exhibit hall, hands-on sessions.', size: 108 },
      { kind: 'photo', img: 'split-b.jpg', pos: '50% 30%', kicker: 'Two', big: 'On the stream', sub: 'The lectures live, from anywhere. Recordings afterward.', size: 100 },
      { kind: 'lead', kicker: 'And crucially', big: 'The same<br>CE credit', sub: 'Live-stream attendance is eligible for exactly the same contact hours.' },
      { kind: 'stat', num: '20', unit: 'CE hours', sub: 'Approved through AAVSB-RACE, ID #20-139-5976.' },
      { kind: 'cta', big: 'No plane ticket<br>required.', sub: 'Choose your format at checkout.' },
    ],
  },
  {
    id: 'F05_saturday', th: TH.inkwell, date: 'Wednesday, September 9',
    angle: 'Saturday splits — canine or equine',
    caption: `Saturday is the day the conference splits in two.

The canine track, and the equine track. You choose yours when you register. Friday and Sunday are the shared days.

Canine: spinal motion, brachial plexus injuries, shoulder, elbow and carpal work.
Equine: sports medicine, rehabilitation and manual therapy for the horse.

https://healingoasis.edu/conference-2026/attend`,
    slides: [
      { kind: 'hook', big: 'On Saturday,<br>you choose.', sub: 'The conference splits into two tracks.', size: 118 },
      { kind: 'photo', img: 'canine.jpg', pos: '50% 30%', kicker: 'Track one', big: 'Canine', sub: 'Spinal motion. Brachial plexus injuries. Shoulder, elbow and carpal work.', size: 150 },
      { kind: 'photo', img: 'equine2.jpg', pos: '50% 46%', kicker: 'Track two', big: 'Equine', sub: 'Sports medicine, rehabilitation and manual therapy for the horse.', size: 150 },
      { kind: 'lead', kicker: 'How it works', big: 'You pick yours<br>at checkout', sub: 'Saturday includes a track selection between canine and equine.' },
      { kind: 'stat', num: '16', unit: 'speakers', sub: 'Across both tracks and the shared days.' },
      { kind: 'cta', big: 'Go where<br>your work is.', sub: 'October 23–25, Lombard, Illinois.' },
    ],
  },
  {
    id: 'F06_what-it-costs', th: TH.sand, date: 'Monday, September 14',
    angle: 'The rates and the discounts',
    caption: `What a seat costs, plainly.

Veterinary technicians — $450
Doctors, DC / DVM / VMD and other licensed professionals — $580
APRVT candidates — $325
ACVSMR residents — $395

Same rate in the room or on the live stream.

Discounts on top: alumni 15%, association members 10%, first responders and military 20%. One per registration, all expiring October 13.

https://healingoasis.edu/conference-2026/attend`,
    slides: [
      { kind: 'hook', big: 'What a seat<br>actually costs.', sub: 'Same rate in the room or on the stream.', size: 112 },
      { kind: 'steps', kicker: 'The rates', items: [
        { n: '$450', t: 'Veterinary technicians', d: '' },
        { n: '$580', t: 'Doctors — DC, DVM, VMD', d: 'And other licensed professionals.' },
        { n: '$325', t: 'APRVT candidates', d: '$395 for ACVSMR residents.' },
      ] },
      { kind: 'stat', num: '20%', unit: 'off', sub: 'First responders and military — active duty and veterans, plus fire, EMS and law enforcement.' },
      { kind: 'stat', num: '15%', unit: 'off', sub: 'Healing Oasis alumni. Association members in good standing get 10%.' },
      { kind: 'lead', kicker: 'The catch', big: 'One discount,<br>per registration', sub: 'And every one of them expires October 13.' },
      { kind: 'cta', big: 'Do not pay<br>more than you owe.', sub: 'Codes go in at checkout.' },
    ],
  },
  {
    id: 'F07_three-days', th: TH.clay, date: 'Monday, September 21',
    angle: 'What three days actually look like',
    caption: `What actually happens over three days.

You sit in lectures given by people who wrote the papers. You put your hands on a patient with a specialist standing next to you. You walk an exhibit hall and find the thing you did not know existed.

And somewhere in the middle of it, you describe the case that has been bothering you for eight months to someone who has seen it before.

That last part is why people come back.
https://healingoasis.edu/conference-2026/attend`,
    slides: [
      { kind: 'hook', big: 'Three days,<br>roughly.', sub: 'What actually happens, in order.', size: 126 },
      { kind: 'photo', img: 'num.jpg', pos: '50% 34%', kicker: 'One', big: 'You sit<br>and listen', sub: 'Sixteen speakers across sports medicine, rehabilitation, neurology and dentistry.' },
      { kind: 'photo', img: 'c-handling.jpg', pos: '50% 30%', kicker: 'Two', big: 'You put your<br>hands on it', sub: 'Hands-on sessions, with the person who wrote the lecture beside you.' },
      { kind: 'photo', img: 'room.jpg', pos: '50% 46%', kicker: 'Three', big: 'You talk in<br>the corridor', sub: 'And describe the case that has bothered you for months to someone who has seen it.' },
      { kind: 'lead', kicker: 'And that third one', big: 'Is why people<br>come back', sub: 'It is the part nobody puts on the schedule.' },
      { kind: 'cta', big: 'Book the three days.<br>Not the two.', sub: 'October 23–25, Lombard, Illinois.' },
    ],
  },
  {
    id: 'F08_the-dates', th: TH.maroon, date: 'Wednesday, September 30',
    angle: 'Every deadline, and the last call',
    caption: `Four dates. Screenshot this one.

SEPTEMBER 16 — the hotel block at the Crowne Plaza Lombard–Downers Grove is released. Call (630) 629-6000 before then.
OCTOBER 12 — registration closes. In the room or on the stream, both shut the same day.
OCTOBER 13 — every discount code expires.
OCTOBER 23–25 — we open the doors in Lombard.

https://healingoasis.edu/conference-2026/attend`,
    slides: [
      { kind: 'hook', num: '4', big: 'dates that<br>decide it.', sub: 'Screenshot this one.' },
      { kind: 'lead', kicker: 'September 16', big: 'The hotel block<br>is released', sub: 'Crowne Plaza Lombard–Downers Grove · (630) 629-6000.', size: 84 },
      { kind: 'lead', kicker: 'October 12', big: 'Registration<br>closes', sub: 'In the room or on the stream — both shut the same day.', size: 96 },
      { kind: 'lead', kicker: 'October 13', big: 'Discounts<br>expire', sub: 'Alumni, association members, first responders and military.', size: 96 },
      { kind: 'stat', num: '23–25', unit: 'October', sub: 'Friday to Sunday. National University of Health Sciences, Lombard, Illinois.', size: 190 },
      { kind: 'cta', big: 'After the 12th,<br>the doors shut.', sub: 'Until next year.' },
    ],
  },
]
