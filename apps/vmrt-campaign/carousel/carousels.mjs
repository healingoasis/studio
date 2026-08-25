// VMRT — Veterinary Massage & Rehabilitation Therapy.
// Twelve carousels, six slides each: 72 images.
//
// Every fact is quoted from the program page, checked 2026-08-25. Nothing here
// repeats an angle from the conference or acupuncture campaigns, and no
// photograph is shared with either — the whole pool comes from the CE sessions.
import { C } from './kit.mjs'

const veilDark = 'linear-gradient(180deg,rgba(14,16,16,0.74) 0%,rgba(14,16,16,0.30) 34%,rgba(14,16,16,0.56) 66%,rgba(14,16,16,0.92) 100%)'
const veilSoft = 'linear-gradient(180deg,rgba(14,16,16,0.62) 0%,rgba(14,16,16,0.16) 40%,rgba(14,16,16,0.80) 100%)'
const ON = '#bfe0d8'   // photo-safe accent

const TH = {
  maroon:  { bg: C.maroon,  ink:'#fff',   sub:'rgba(245,236,223,0.86)', accent:'#bfe0d8', tone:'light', rule:'rgba(245,236,223,0.26)', veil:veilSoft, accentOn:ON },
  slate:   { bg:'#274a46',  ink:'#fff',   sub:'rgba(232,244,240,0.84)', accent:'#e8dcc8', tone:'light', rule:'rgba(232,244,240,0.26)', veil:veilDark, accentOn:ON, ctaInk:'#274a46' },
  paper:   { bg: C.paper,   ink: C.ink,   sub: C.muted,                 accent:'#2f5d57', tone:'dark',  rule:'rgba(47,93,87,0.20)',    veil:veilSoft, accentOn:ON },
  night:   { bg:'#111716',  ink:'#fff',   sub:'rgba(232,244,240,0.78)', accent:'#7fb8ac', tone:'light', rule:'rgba(232,244,240,0.22)', veil:veilDark, accentOn:ON },
  bone:    { bg:'#f2efe7',  ink:'#1c2321',sub:'#5d6b67',                accent:'#2f5d57', tone:'dark',  rule:'rgba(28,35,33,0.14)',    veil:veilSoft, accentOn:ON },
  oxblood: { bg:'#3d0505',  ink: C.cream, sub:'rgba(245,236,223,0.82)', accent:'#a8cfc6', tone:'light', rule:'rgba(245,236,223,0.22)', veil:veilDark, accentOn:ON, ctaInk:'#3d0505' },
  sage:    { bg:'#dfe6df',  ink:'#1c2321',sub:'#5d6b67',                accent:'#8f2f2f', tone:'dark',  rule:'rgba(28,35,33,0.16)',    veil:veilSoft, accentOn:ON },
  ink:     { bg:'#0f1413',  ink:'#fff',   sub:'rgba(255,255,255,0.76)', accent:'#7fb8ac', tone:'light', rule:'rgba(255,255,255,0.18)', veil:veilDark, accentOn:ON },
  clay:    { bg:'#6b3a2c',  ink:'#fff',   sub:'rgba(255,244,238,0.86)', accent:'#dbeae4', tone:'light', rule:'rgba(255,255,255,0.24)', veil:veilSoft, accentOn:ON, ctaInk:'#6b3a2c' },
  deep:    { bg:'#1d3330',  ink:'#fff',   sub:'rgba(232,244,240,0.82)', accent:'#e8dcc8', tone:'light', rule:'rgba(232,244,240,0.24)', veil:veilDark, accentOn:ON, ctaInk:'#1d3330' },
  linen:   { bg:'#efeae0',  ink:'#2f5d57',sub:'#5d6b67',                accent:'#8f2f2f', tone:'dark',  rule:'rgba(47,93,87,0.20)',    veil:veilSoft, accentOn:ON },
  charcoal:{ bg:'#1f2321',  ink: C.cream, sub:'rgba(232,244,240,0.76)', accent:'#7fb8ac', tone:'light', rule:'rgba(232,244,240,0.20)', veil:veilDark, accentOn:ON },
}

// Each used exactly once. All from the CE sessions — untouched by the other campaigns.
export const POOL = [
  'v-cart.jpg','v-table1.jpg','v-greet.jpg','v-hands1.jpg','v-boxer.jpg','v-arena2.jpg',
  'v-frenchie2.jpg','v-collie.jpg','v-horse3.jpg','v-cohort1.jpg','v-bend.jpg','v-pony.jpg',
  'v-table2.jpg','v-brown.jpg','v-arena1.jpg','v-kennel.jpg','v-seated.jpg','v-palomino.jpg',
  'v-group1.jpg','v-small.jpg','v-horse1.jpg','v-cart2.jpg','v-arena3.jpg','v-brown2.jpg',
  'v-circle.jpg','v-barn1.jpg','v-frenchie1.jpg','v-arena4.jpg','v-cohort2.jpg','v-horse2.jpg',
  'v-arena5.jpg','v-arena6.jpg','v-clinic2.jpg','v-clinic3.jpg','v-clinic4.jpg',
]

const URL = 'healingoasis.edu — VMRT Program'

export const CAROUSELS = [
  {
    id: 'V01_four-legged', th: TH.deep, date: 'Wednesday, August 26',
    angle: 'The Four-Legged Faculty — they are named on the site',
    caption: `Twelve of our faculty have four legs, and every one of them has a name.

Tony. Jake. Kevin. Vito. Dunkin. Who. Dash. Breezy. Stitch. Bullseye. Maximus. Stella Jane and Hannah Sue.

Dogs, horses and donkeys — a mixture of breed animals and rescues. They are on our faculty page alongside everyone else, because that is what they are. You will spend 142 supervised hours with them.

Fall 2026 and Spring 2027 are both open.
healingoasis.edu`,
    slides: [
      { kind: 'hook', num: '12', big: 'of our faculty<br>have four legs', sub: 'And every one of them has a name.' },
      { kind: 'quad', kicker: 'The Four-Legged Faculty', people: [
        ['ff-tony','Tony',''], ['ff-jake','Jake',''], ['ff-kevin','Kevin',''], ['ff-vito','Vito',''],
      ] },
      { kind: 'quad', kicker: 'Also teaching', people: [
        ['ff-dunkin','Dunkin',''], ['ff-who','Who',''], ['ff-dash','Dash',''], ['ff-breezy','Breezy',''],
      ] },
      { kind: 'quad', kicker: 'And the rest of the department', people: [
        ['ff-stitch','Stitch',''], ['ff-bullseye','Bullseye',''], ['ff-maximus','Maximus',''], ['ff-stella-hannah','Stella Jane &amp; Hannah Sue',''],
      ] },
      { kind: 'lead', kicker: 'What you actually work on', big: 'A mixture of breed<br>animals and rescues', sub: 'Dogs, horses and donkeys — live patients, supervised throughout.', size: 76 },
      { kind: 'cta', big: '142 hours<br>in their company.', sub: 'Fall 2026 and Spring 2027 are both open.' },
    ],
  },
  {
    id: 'V02_who-can-enroll', th: TH.paper, date: 'Friday, August 28',
    angle: 'Eligibility — far broader than people assume',
    caption: `You do not have to be a veterinarian.

The VMRT program is open to licensed veterinarians, licensed or certified veterinary technicians, licensed physical therapists, licensed nurses, licensed or certified massage therapists, or any other licensed healthcare professional.

That is the widest door of any program we run, and most people who would be good at this never check whether they qualify.

142 hours. Four modules. Fall 2026 and Spring 2027 both open.
healingoasis.edu`,
    slides: [
      { kind: 'hook', big: 'You do not have<br>to be a vet.', sub: 'The most common reason people never ask.', size: 116 },
      { kind: 'steps', kicker: 'Who this is open to', items: [
        { n: '01', t: 'Licensed veterinarians', d: '' },
        { n: '02', t: 'Licensed or certified veterinary technicians', d: '' },
        { n: '03', t: 'Licensed physical therapists', d: '' },
      ] },
      { kind: 'steps', kicker: 'And also', items: [
        { n: '04', t: 'Licensed nurses', d: '' },
        { n: '05', t: 'Licensed or certified massage therapists', d: '' },
        { n: '06', t: 'Any other licensed healthcare professional', d: '' },
      ] },
      { kind: 'lead', kicker: 'Read that last one again', big: 'Any other licensed<br>healthcare<br>professional', sub: 'If you are licensed and you work with your hands, ask us.', size: 76 },
      { kind: 'stat', num: '142', unit: 'hours', sub: 'A postgraduate, state-approved certification — whichever door you came in through.' },
      { kind: 'cta', big: 'Check before<br>you rule it out.', sub: 'info@healingoasis.edu · 262-898-1680' },
    ],
  },
  {
    id: 'V03_you-choose-species', th: TH.slate, date: 'Sunday, August 30',
    angle: 'Species content follows the students',
    caption: `You tell us what you want to work on.

"Species content (dogs and or horses) will be determined according to the student attendees' preferences. For example, we can work on all dogs or a mixture of dogs and horses."

A small class makes that possible. It is not a fixed syllabus you fit yourself around — the hands-on follows the room.

142 hours across four modules. Fall 2026 and Spring 2027 both open.
healingoasis.edu`,
    slides: [
      { kind: 'hook', big: 'Dogs? Horses?<br>Both?', sub: 'You are asked, and then it is arranged.', size: 116 },
      { kind: 'lead', kicker: 'From the program page', big: 'Determined by<br>student preference', sub: 'Species content is set according to the attendees, not fixed in advance.', size: 80 },
      { kind: 'photo', img: 'v-arena2.jpg', kicker: 'So it could be', big: 'A mixture of<br>dogs and horses', sub: 'Or all dogs. The room decides.' },
      { kind: 'lead', kicker: 'Why this is possible', big: 'The class<br>is small', sub: 'Compare the number of students allowed before you compare anything else.' },
      { kind: 'stat', num: '4', unit: 'modules', sub: 'Thursday 8:00 AM until Sunday, no later than 1:00 PM.' },
      { kind: 'cta', big: 'Built around<br>who turns up.', sub: 'Fall 2026 and Spring 2027 are both open.' },
    ],
  },
  {
    id: 'V04_142-hours', th: TH.night, date: 'Tuesday, September 1',
    angle: 'The shape of the commitment',
    caption: `142 hours of supervised instruction, in four modules.

Each one runs Thursday 8:00 AM until Sunday, no later than 1:00 PM. Four long weekends, and then you are certified.

No external externships are required — all clinical and practical work with therapeutic exercises is included, which means no extra weeks away from your practice on top of the four.

healingoasis.edu`,
    slides: [
      { kind: 'hook', num: '142', big: 'hours of<br>supervised instruction', sub: 'Divided into four modules.' },
      { kind: 'stat', num: '4', unit: 'modules', sub: 'Thursday 8:00 AM until Sunday, no later than 1:00 PM.' },
      { kind: 'lead', kicker: 'Which is', big: 'Four long<br>weekends', sub: 'Not a year of evening classes. Four weekends, and the work in between.' },
      { kind: 'stat', num: '0', unit: 'externships', sub: 'No external externships are required. The clinical and practical work is all inside the program.' },
      { kind: 'lead', kicker: 'The point of that', big: 'Minimum time<br>away from<br>your practice', sub: 'Which is the number most programs quietly leave out of the comparison.', size: 82 },
      { kind: 'cta', big: 'Four weekends.<br>One certification.', sub: '142 hours, supervised throughout.' },
    ],
  },
  {
    id: 'V05_the-faculty', th: TH.bone, date: 'Thursday, September 3',
    angle: 'Who teaches VMRT, taken from the faculty page',
    caption: `Eleven people teach the VMRT program.

PROGRAM DIRECTORS
Michelle J. Rivera — MT, VDT
Pedro Luis Rivera — DVM, FACFN, DACVSMR, FCoAC

SENIOR FACULTY FOR VMRT
Amber Ihrke — DVM, DACVSMR, CVSMT
Rosemary LoGiudice — DVM, DACVSMR, CVSMT
Deanne Zenoni — DVM, CVSMT, CVMRT

FACULTY
Julia Tomlinson — BVSc, MS, PhD, DACVS, DACVSMR, CVSMT
Teresa Calvert — DVM, CVSMT, CVMRT

ADJUNCT FACULTY
Andris Kaneps — DVM, MS, PhD, DACVS, DACVSMR
Douglas Gould — PhD
Gregory Cramer — DC, PhD
Stephanie Thomovsky — DVM, MS, DACVIM-Neurology

All hands-on is supervised by board-certified experts, residents and faculty.
healingoasis.edu`,
    slides: [
      { kind: 'hook', num: '11', big: 'people teach<br>this program', sub: 'Directors, senior faculty, faculty and adjuncts.' },
      { kind: 'quad', kicker: 'Program directors and senior faculty', people: [
        ['michelle','Michelle J. Rivera','Program Director'],
        ['pedro','Pedro Luis Rivera','Program Director'],
        ['ihrke','Amber Ihrke','Senior Faculty'],
        ['zenoni','Deanne Zenoni','Senior Faculty'],
      ] },
      { kind: 'quad', kicker: 'Senior faculty and faculty', people: [
        ['logiudice','Rosemary LoGiudice','Senior Faculty'],
        ['tomlinson','Julia Tomlinson','Faculty · BVSc, PhD'],
        ['calvert','Teresa Calvert','Faculty · DVM'],
        ['kaneps','Andris Kaneps','Adjunct faculty'],
      ] },
      { kind: 'quad', kicker: 'Adjunct faculty', people: [
        ['gould','Douglas Gould','Adjunct · PhD'],
        ['cramer','Gregory Cramer','Adjunct · DC, PhD'],
        ['thomovsky','Stephanie Thomovsky','Adjunct · Neurology'],
      ] },
      { kind: 'lead', kicker: 'All hands-on is', big: 'Supervised by<br>board-certified<br>experts', sub: 'Plus residents and outstanding faculty. Extensively, and throughout.', size: 76 },
      { kind: 'cta', big: 'Eleven of them.<br>A small class.', sub: 'Fall 2026 and Spring 2027 are both open.' },
    ],
  },
  {
    id: 'V06_54-ce-hours', th: TH.oxblood, date: 'Saturday, September 5',
    angle: 'CE credit and the accreditations',
    caption: `54 CE hours through AAVSB-RACE, ID #87-37619.

All attendees receive CE for attending the modules. Current approvals include the AHVMA, an AVMA-HOD-recognized organization; validated CE presented by an institution accredited by the US Department of Education; AAVSB-RACE for 54 hours; and the Minnesota Board of Chiropractic Examiners.

142 hours of instruction. Four modules. Fall 2026 and Spring 2027 both open.
healingoasis.edu`,
    slides: [
      { kind: 'hook', num: '54', big: 'CE hours', sub: 'Through AAVSB-RACE, ID #87-37619.' },
      { kind: 'steps', kicker: 'Current approvals', items: [
        { n: '01', t: 'AHVMA', d: 'An AVMA-HOD-recognized organization.' },
        { n: '02', t: 'AAVSB-RACE', d: 'ID #87-37619, for 54 hours.' },
        { n: '03', t: 'MN Board of Chiropractic Examiners', d: '' },
      ] },
      { kind: 'lead', kicker: 'And one more', big: 'Accredited by the<br>US Department<br>of Education', sub: 'Validated CE, presented by an accredited institution.', size: 72 },
      { kind: 'lead', kicker: 'Worth being clear about', big: 'State-approved,<br>postgraduate', sub: 'Not a weekend certificate. A postgraduate state-approved certification program.', size: 82 },
      { kind: 'stat', num: '142', unit: 'hours', sub: 'Supervised instruction, of which 54 carry RACE CE credit.' },
      { kind: 'cta', big: 'Earned, filed,<br>and recognized.', sub: 'Fall 2026 and Spring 2027 are both open.' },
    ],
  },
  {
    id: 'V07_module-week', th: TH.charcoal, date: 'Monday, September 7',
    angle: 'What a module weekend is actually like',
    caption: `What a module weekend actually looks like.

Thursday 8:00 AM, straight in. Then Friday and Saturday. Then Sunday, finishing no later than 1:00 PM so you can get home.

Extensive supervised hands-on clinical learning under board-certified experts, residents and faculty — with therapeutic exercises included, and no external externships required.

Four of these. That is the whole program.
healingoasis.edu`,
    slides: [
      { kind: 'hook', big: 'Thursday<br>to Sunday.', sub: 'Four times. That is the entire program.', size: 126 },
      { kind: 'steps', kicker: 'How the weekend runs', items: [
        { n: 'Thu', t: '8:00 AM start', d: 'You are working the same morning you arrive.' },
        { n: 'Fri–Sat', t: 'Hands-on, all day', d: 'Supervised clinical learning and therapeutic exercises.' },
        { n: 'Sun', t: 'Finished by 1:00 PM', d: 'Built so you can drive home the same day.' },
      ] },
      { kind: 'lead', kicker: 'Throughout', big: 'Supervised.<br>Extensively.', sub: 'Under board-certified experts, residents and outstanding faculty.' },
      { kind: 'lead', kicker: 'Included, not extra', big: 'Therapeutic<br>exercises', sub: 'All clinical and practical work is part of the program.' },
      { kind: 'stat', num: '4', unit: 'weekends', sub: 'September to December, or March to June. You choose the class.' },
      { kind: 'cta', big: 'Home by Sunday<br>afternoon.', sub: 'Four times, and then you are certified.' },
    ],
  },
  {
    id: 'V08_compare-us', th: TH.sage, date: 'Wednesday, September 9',
    angle: 'The three things worth comparing',
    caption: `If you are deciding between programs, our page tells you exactly what to compare.

"Compare COST, TIME AWAY FROM YOUR PRACTICE, and, most importantly, the number of students allowed for the program — to provide an excellent student-to-instructor ratio during hands-on lab and clinical cases."

We would rather you checked all three than took our word for any of them.

142 hours · $6,189 · four weekends · a small class.
healingoasis.edu`,
    slides: [
      { kind: 'hook', num: '3', big: 'things to<br>compare', sub: 'Our own page tells you which ones.' },
      { kind: 'lead', kicker: 'One', big: 'Cost', sub: '$6,189 for the whole program. Not per module.', size: 150 },
      { kind: 'lead', kicker: 'Two', big: 'Time away<br>from practice', sub: 'Four weekends. No external externships required.', size: 92 },
      { kind: 'lead', kicker: 'Three, and most important', big: 'How many students<br>they let in', sub: 'Because that is what sets the ratio during hands-on lab and clinical cases.', size: 74 },
      { kind: 'lead', kicker: 'We are saying this', big: 'Go and check<br>the other ones', sub: 'We would rather you compared than took our word for it.', size: 84 },
      { kind: 'cta', big: 'Then come<br>back to us.', sub: '142 hours, four weekends, a small class.' },
    ],
  },
  {
    id: 'V09_what-it-costs', th: TH.linen, date: 'Friday, September 11',
    angle: 'The money, plainly',
    caption: `$6,189 for the whole program. Not per module.

A $200 deposit holds your place, with the balance due as arranged. Payment by check or money order drawn on a US bank account, cash, or MasterCard and Visa — card transactions carry a 3.5% charge.

That covers 142 hours of supervised instruction across four modules, all clinical and practical work with therapeutic exercises, and no required external externships.

healingoasis.edu`,
    slides: [
      { kind: 'hook', num: '$6,189', big: 'the whole<br>program', sub: 'Not per module. All four.', size: 104 },
      { kind: 'stat', num: '$200', unit: 'deposit', sub: 'Holds your place in either class.' },
      { kind: 'steps', kicker: 'Which covers', items: [
        { n: '01', t: '142 hours of supervised instruction', d: 'Across four modules.' },
        { n: '02', t: 'All clinical and practical work', d: 'Therapeutic exercises included.' },
        { n: '03', t: 'No external externships', d: 'No extra weeks away on top of the four.' },
      ] },
      { kind: 'lead', kicker: 'How to pay', big: 'Check, cash,<br>or card', sub: 'Money orders on a US bank account. Card transactions carry a 3.5% charge.' },
      { kind: 'lead', kicker: 'Already certified elsewhere?', big: 'You can audit<br>a module', sub: 'Module I, II or III, if you have completed a state-approved rehabilitation program. Call the office.', size: 84 },
      { kind: 'cta', big: 'One price.<br>Four modules.', sub: '$200 holds your place.' },
    ],
  },
  {
    id: 'V10_after-graduation', th: TH.clay, date: 'Sunday, September 13',
    angle: 'What graduates keep',
    caption: `What every successful graduate receives.

Unlimited access to consultations with the program director. A listing in our Find a Graduate / Alumni section. And a discount on CE seminars, including our yearly conference.

Unlimited means unlimited. It is not a support window that closes ninety days after you finish.

142 hours. Four modules. Fall 2026 and Spring 2027 both open.
healingoasis.edu`,
    slides: [
      { kind: 'hook', big: 'It does not stop<br>at the certificate.', sub: 'Three things every graduate keeps.', size: 100 },
      { kind: 'lead', kicker: 'One', big: 'Unlimited<br>consultations', sub: 'With the program director. Not a ninety-day support window.' },
      { kind: 'lead', kicker: 'Two', big: 'Listed as<br>a graduate', sub: 'In the Find a Graduate / Alumni section, where people go looking for you.' },
      { kind: 'lead', kicker: 'Three', big: 'Discounted CE', sub: 'On our seminars, and on the yearly conference.', size: 108 },
      { kind: 'stat', num: '142', unit: 'hours', sub: 'And then a door that stays open afterwards.' },
      { kind: 'cta', big: 'Certified, and<br>still supported.', sub: 'Fall 2026 and Spring 2027 are both open.' },
    ],
  },
  {
    id: 'V11_two-classes', th: TH.ink, date: 'Tuesday, September 15',
    angle: 'Both classes, and every date',
    caption: `Two classes are open. Here are all eight dates.

FALL 2026
Module I — Sept 3–6 · Module II — Oct 8–11 · Module III — Nov 19–22 · Module IV — Dec 10–14

SPRING 2027
Module I — Mar 11–14 · Module II — Apr 8–11 · Module III — May 20–23 · Module IV — June 10–13

A minimum number of students must be met to hold each program. Fall 2027 dates are still to be announced.

healingoasis.edu`,
    slides: [
      { kind: 'hook', num: '2', big: 'classes<br>open now', sub: 'Fall 2026 and Spring 2027. Screenshot this one.' },
      { kind: 'steps', kicker: 'Fall 2026', items: [
        { n: 'I', t: 'Sept 3–6, 2026', d: '' },
        { n: 'II', t: 'Oct 8–11, 2026', d: '' },
        { n: 'III', t: 'Nov 19–22, 2026', d: 'Module IV follows Dec 10–14.' },
      ] },
      { kind: 'steps', kicker: 'Spring 2027', items: [
        { n: 'I', t: 'Mar 11–14, 2027', d: '' },
        { n: 'II', t: 'Apr 8–11, 2027', d: '' },
        { n: 'III', t: 'May 20–23, 2027', d: 'Module IV follows June 10–13.' },
      ] },
      { kind: 'lead', kicker: 'Worth knowing', big: 'A minimum number<br>must be met', sub: 'Each class needs enough students to run. Early registrations decide that.', size: 76 },
      { kind: 'lead', kicker: 'And after those', big: 'Fall 2027,<br>dates to come', sub: 'If neither of these two fits, tell us and we will let you know.' },
      { kind: 'cta', big: 'Pick the one<br>that fits.', sub: '$200 holds your place in either.' },
    ],
  },
  {
    id: 'V12_september-3', th: TH.maroon, date: 'Thursday, September 17',
    angle: 'Closing — both doors, and how to walk through',
    caption: `Veterinary Massage & Rehabilitation Therapy.

142 hours of supervised instruction. Four modules, Thursday to Sunday. Dogs, horses, or both — decided by the students in the room. All of it hands-on, on live animals, supervised throughout.

Open to licensed veterinarians, veterinary technicians, physical therapists, nurses, massage therapists and any other licensed healthcare professional.

$6,189, with $200 holding your place. Fall 2026 and Spring 2027 are both open.

info@healingoasis.edu · 262-898-1680 · healingoasis.edu`,
    slides: [
      { kind: 'hook', big: 'Veterinary<br>Massage &amp;<br>Rehabilitation<br>Therapy', sub: 'Postgraduate. State-approved. 142 hours.', size: 86 },
      { kind: 'stat', num: '142', unit: 'hours', sub: 'Four modules, Thursday 8:00 AM to Sunday 1:00 PM.' },
      { kind: 'lead', kicker: 'Open to', big: 'More people<br>than you think', sub: 'Vets, technicians, physical therapists, nurses, massage therapists — any licensed healthcare professional.', size: 88 },
      { kind: 'lead', kicker: 'Taught on', big: 'Live animals,<br>supervised', sub: 'A mixture of breed dogs and rescued animals, never worked on unsupervised.', size: 88 },
      { kind: 'stat', num: '$200', unit: 'holds a place', sub: 'Tuition is $6,189 for the whole program.' },
      { kind: 'cta', big: 'Two classes.<br>Both open.', sub: 'info@healingoasis.edu · 262-898-1680', foot: 'Fall 2026 · Spring 2027 · Sturtevant, Wisconsin' },
    ],
  },
]
