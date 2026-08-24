// Twelve carousels, six slides each — 72 images, which is the count that was in
// the folder, delivered in the format the research says actually travels.
// Every fact is from healingoasis.edu/acupuncture, checked 2026-08-24.
import { C } from './kit.mjs'

const veilDark = 'linear-gradient(180deg,rgba(18,6,6,0.72) 0%,rgba(18,6,6,0.28) 34%,rgba(18,6,6,0.55) 66%,rgba(18,6,6,0.92) 100%)'
const veilSoft = 'linear-gradient(180deg,rgba(18,6,6,0.62) 0%,rgba(18,6,6,0.14) 40%,rgba(18,6,6,0.78) 100%)'

// Twelve skins. Consistency inside a carousel, difference between them.
const TH = {
  maroon:   { bg: C.maroon,  ink: '#fff',    sub: 'rgba(245,236,223,0.86)', accent: C.brass, tone: 'light', rule: 'rgba(245,236,223,0.26)', veil: veilSoft },
  paper:    { bg: C.paper,   ink: C.ink,     sub: C.muted,                  accent: C.maroon,tone: 'dark',  rule: 'rgba(92,1,1,0.16)',      veil: veilSoft },
  night:    { bg: C.night,   ink: '#fff',    sub: 'rgba(245,236,223,0.78)', accent: C.brass, tone: 'light', rule: 'rgba(245,236,223,0.22)', veil: veilDark },
  cocoa:    { bg: '#26150c', ink: C.cream,   sub: 'rgba(245,236,223,0.76)', accent: '#d9a441',tone:'light', rule: 'rgba(245,236,223,0.20)', veil: veilDark },
  sand:     { bg: '#e9dcc6', ink: '#2a1512', sub: '#6b5550',                accent: C.maroon,tone: 'dark',  rule: 'rgba(92,1,1,0.18)',      veil: veilSoft },
  oxblood:  { bg: '#400202', ink: C.cream,   sub: 'rgba(245,236,223,0.80)', accent: '#d9c9a8',tone:'light', rule: 'rgba(245,236,223,0.22)', veil: veilDark, ctaInk: '#400202' },
  bone:     { bg: '#f3efe6', ink: '#1f1412', sub: '#6b5550',                accent: C.brass, tone: 'dark',  rule: 'rgba(31,20,18,0.14)',    veil: veilSoft },
  inkwell:  { bg: '#14100e', ink: '#fff',    sub: 'rgba(255,255,255,0.74)', accent: C.brass, tone: 'light', rule: 'rgba(255,255,255,0.18)', veil: veilDark },
  clay:     { bg: '#7a3320', ink: '#fff',    sub: 'rgba(255,244,232,0.86)', accent: '#f0dcc0',tone:'light', rule: 'rgba(255,255,255,0.24)', veil: veilSoft, ctaInk: '#7a3320' },
  linen:    { bg: '#efe6d8', ink: C.maroon,  sub: '#6b5550',                accent: C.ink,   tone: 'dark',  rule: 'rgba(92,1,1,0.16)',      veil: veilSoft },
  charcoal: { bg: '#221c19', ink: C.cream,   sub: 'rgba(245,236,223,0.74)', accent: C.brass, tone: 'light', rule: 'rgba(245,236,223,0.20)', veil: veilDark },
  deep:     { bg: C.deep,    ink: '#fff',    sub: 'rgba(245,236,223,0.82)', accent: C.brass, tone: 'light', rule: 'rgba(245,236,223,0.24)', veil: veilDark },
}

export const CAROUSELS = [
  {
    id: 'C01_132-hours', th: TH.maroon, date: 'Wednesday, August 26',
    angle: 'The size of the commitment, stated up front',
    caption: `132 hours of supervised training. Five modules. September to February.

Three of the five are Virtual-Live — Wednesday to Sunday, 8am to noon, from wherever you are. Two are face-to-face in Sturtevant, Wisconsin, and those are the long days with your hands on a patient.

No required additional externships. Five long weekends, not a year away from your practice.

$200 holds a seat. Module I begins September 16.
healingoasis.edu/acupuncture`,
    slides: [
      { kind: 'hook', num: '132', big: 'hours of<br>supervised training', sub: 'Five modules. September to February.' },
      { kind: 'stat', num: '5', unit: 'modules', sub: 'Wednesday to Sunday, every single time.' },
      { kind: 'lead', kicker: 'Three of the five', big: 'You never<br>leave home', sub: 'Modules I, III and IV run Virtual-Live, 8am to noon daily.' },
      { kind: 'photo', img: 'hands-dog.jpg', pos: '52% 46%', kicker: 'The other two', big: 'Hands on<br>a patient', sub: 'Modules II and V, face-to-face in Sturtevant, Wisconsin.' },
      { kind: 'stat', num: '0', unit: 'externships', sub: 'No required additional externships. The practicum is inside the program, not bolted on after it.' },
      { kind: 'cta', big: 'Five weekends.<br>One certificate.', sub: '$200 holds a seat.' },
    ],
  },
  {
    id: 'C02_who-teaches', th: TH.paper, date: 'Friday, August 28',
    angle: 'The five named faculty, one per slide',
    caption: `Five people teach this program.

Daniel Halden — DC, MAc, LAc, Dipl.Ac (NCCAOM), PAK, CAC, CVMRT
Lynne Dennis — DVM, CVA, FAAVA, CVSMT, CVMRT
Victoria Gnadt — DVM, CVSMT, CVA
Michelle Rivera — MT, VDT
Pedro Rivera — DVM, FACFN, DACVSMR, FCoAC

Among others. Twenty students maximum, and for clinical hands-on the ratio is held to three or four students per faculty member.

healingoasis.edu/acupuncture`,
    slides: [
      { kind: 'hook', num: '5', big: 'people<br>teach this', sub: 'And never more than four of you to one of them.' },
      { kind: 'person', img: 'faculty/halden.jpg', name: 'Daniel Halden', cred: 'DC, MAc, LAc, Dipl.Ac (NCCAOM), PAK, CAC, CVMRT', line: '' },
      { kind: 'person', img: 'faculty/dennis.jpg', name: 'Lynne Dennis', cred: 'DVM, CVA, FAAVA, CVSMT, CVMRT', line: '' },
      { kind: 'person', img: 'faculty/gnadt.jpg', name: 'Victoria Gnadt', cred: 'DVM, CVSMT, CVA', line: '' },
      { kind: 'person', img: 'faculty/michelle.jpg', name: 'Michelle Rivera', cred: 'MT, VDT', line: '' },
      { kind: 'person', img: 'faculty/pedro.jpg', name: 'Pedro Rivera', cred: 'DVM, FACFN, DACVSMR, FCoAC', line: 'Among others.' },
    ],
  },
  {
    id: 'C03_twenty-seats', th: TH.oxblood, date: 'Sunday, August 30',
    angle: 'Class size and the hands-on ratio',
    caption: `Twenty. That is the whole class.

A maximum of twenty students per class, and for clinical hands-on we hold the ratio to three or four students to one faculty member.

That number is not a marketing decision. It is the number at which everyone in the room gets their hands on a patient with someone experienced standing beside them.

healingoasis.edu/acupuncture`,
    slides: [
      { kind: 'hook', num: '20', big: 'seats.<br>That is the class.', sub: 'Not a lecture hall. A room.' },
      { kind: 'stat', num: '3–4', unit: 'to one', sub: 'The ratio we hold for clinical hands-on. Three or four students to one faculty member.' },
      { kind: 'photo', img: 'detail-dog.jpg', pos: '50% 44%', kicker: 'Which means', big: 'Your hands,<br>not your notes', sub: 'Extensive hands-on clinical practicums, supervised throughout.' },
      { kind: 'lead', kicker: 'Why it matters', big: 'You cannot learn<br>this by watching', sub: 'The number is set by how many people can be supervised properly at once.' },
      { kind: 'stat', num: '132', unit: 'hours', sub: 'All of them supervised. That is what the number is for.' },
      { kind: 'cta', big: 'Twenty seats.<br>Fall 2026.', sub: '$200 holds one of them.' },
    ],
  },
  {
    id: 'C04_section-one', th: TH.bone, date: 'Tuesday, September 1',
    angle: 'Section One — the foundations you start with',
    caption: `What Section One actually covers.

Introduction to the Foundations of Chinese Medicine. Types of Qi. Qi, Blood and Shen, and how each is formed. Five Element correspondences, the Sheng cycle and the K'o cycle. Introductory ideas of channels, points, point functions and history. Introduction to formulas for Qi, Blood and Shen.

Online LIVE, Wednesday to Sunday, 8am to noon. September 16–20.

Topics covered during each section include, but are not limited to, the above.
healingoasis.edu/acupuncture`,
    slides: [
      { kind: 'hook', big: 'Section One.<br>Where it<br>starts.', sub: 'Online LIVE · September 16–20', size: 100 },
      { kind: 'lead', kicker: 'You begin with', big: 'Foundations of<br>Chinese Medicine', sub: 'Types of Qi. Qi, Blood and Shen — and how each one is formed.', size: 88 },
      { kind: 'steps', kicker: 'Then the cycles', items: [
        { n: '5', t: 'Element correspondences', d: 'The framework everything after this hangs on.' },
        { n: '\u2192', t: 'The Sheng cycle', d: 'How the elements generate one another.' },
        { n: '\u2715', t: 'The K\u2019o cycle', d: 'And how they control one another.' },
      ] },
      { kind: 'lead', kicker: 'And then', big: 'Channels, points,<br>point functions', sub: 'Introductory ideas — plus the history of where all of it came from.', size: 82 },
      { kind: 'lead', kicker: 'Closing the section', big: 'Formulas for Qi,<br>Blood and Shen', sub: 'Introduced here, expanded in Sections Three and Four.', size: 82 },
      { kind: 'cta', big: 'Five days.<br>From your desk.', sub: 'Online LIVE, Wednesday to Sunday, 8am to noon.' },
    ],
  },
  {
    id: 'C05_both-species', th: TH.night, date: 'Thursday, September 3',
    angle: 'Canine and equine in one program',
    caption: `Canine and equine. Both, in the same program.

Not a small-animal course with a horse chapter bolted on the end. You learn both, from people who work on both.

132 hours of supervised training, five modules, extensive hands-on clinical practicums.

healingoasis.edu/acupuncture`,
    slides: [
      { kind: 'hook', img: 'hero-horse.jpg', pos: '58% 44%', big: 'Canine<br>and equine', sub: 'Both. In the same program.' },
      { kind: 'photo', img: 'dog-tall.jpg', pos: '46% 30%', kicker: 'One', big: 'Canine', sub: 'Supervised, hands-on, throughout the program.', size: 130 },
      { kind: 'photo', img: 'horse-band.jpg', pos: '50% 42%', kicker: 'Two', big: 'Equine', sub: 'Same program. Same certificate. Same hands.', size: 130 },
      { kind: 'lead', kicker: 'Not an add-on', big: 'Both, or it<br>is not the job', sub: 'The species are taught together because that is how the practice runs.' },
      { kind: 'stat', num: '132', unit: 'hours', sub: 'Across five modules, canine and equine throughout.' },
      { kind: 'cta', big: 'Two species.<br>One certificate.', sub: 'Module I begins September 16, 2026.' },
    ],
  },
  {
    id: 'C06_what-it-stands-on', th: TH.charcoal, date: 'Saturday, September 5',
    angle: 'The credentials behind the certificate',
    caption: `What the certificate is standing on.

The program is built on the fundamentals consistent with the practice of acupuncture in the United States and with the National Certification Commission for Acupuncture and Oriental Medicine.

Continuing Education contact hours are provided by the AHVMA, an AVMA-HOD-recognized organization.

Two cases presented in SOAP format to the program director for evaluation.

healingoasis.edu/acupuncture`,
    slides: [
      { kind: 'hook', big: 'What the<br>certificate<br>stands on', sub: 'Three things, and none of them are our opinion.', size: 96 },
      { kind: 'lead', kicker: 'One', big: 'NCCAOM', sub: 'Built on the fundamentals consistent with the practice of acupuncture in the United States, and with the National Certification Commission for Acupuncture and Oriental Medicine.', size: 140 },
      { kind: 'lead', kicker: 'Two', big: 'AHVMA', sub: 'Continuing Education contact hours provided by the American Holistic Veterinary Medical Association, an AVMA-HOD-recognized organization.', size: 140 },
      { kind: 'lead', kicker: 'Three', big: 'Two SOAP<br>cases', sub: 'Presented to the program director for evaluation during Module IV or V.' },
      { kind: 'stat', num: '132', unit: 'supervised hours', sub: 'Not attended. Supervised.' },
      { kind: 'cta', big: 'Earn it,<br>do not buy it.', sub: 'Module I begins September 16, 2026.' },
    ],
  },
  {
    id: 'C07_after-graduation', th: TH.sand, date: 'Monday, September 7',
    angle: 'The graduate benefits nobody scrolls to',
    caption: `The part of the program page nobody scrolls far enough to find.

Every successful graduate receives unlimited access to consultations with the program director, a listing in our Find a Graduate / Alumni section, and access to the VSMT alumni section holding every technique and explanation film used during the program.

Plus a percentage discount on our CE seminars and yearly conference, and 10% off the VMRT postgraduate program for you or someone you send.

healingoasis.edu/acupuncture`,
    slides: [
      { kind: 'hook', big: 'It does not end<br>at the certificate', sub: 'Five things every graduate keeps.', size: 92 },
      { kind: 'lead', kicker: 'One', big: 'Unlimited<br>consultations', sub: 'With the program director. Not a support window — unlimited.' },
      { kind: 'lead', kicker: 'Two', big: 'Listed as<br>a graduate', sub: 'In the Find a Graduate / Alumni section, where people go looking.' },
      { kind: 'lead', kicker: 'Three', big: 'The film<br>library', sub: 'Every technique and explanation film used during the program.' },
      { kind: 'steps', kicker: 'And four, and five', items: [
        { n: '04', t: 'Discounted CE', d: 'A percentage off our seminars and the yearly conference.' },
        { n: '05', t: '10% off VMRT', d: 'For you, or an associate or technician you send.' },
      ] },
      { kind: 'cta', big: 'Where it starts,<br>not where it stops.', sub: 'Module I begins September 16, 2026.' },
    ],
  },
  {
    id: 'C08_the-money', th: TH.linen, date: 'Wednesday, September 9',
    angle: 'The money, stated plainly',
    caption: `Let us be plain about the money.

$200 holds your seat. The balance is $7,900.24 by check — card payments carry a 3.4% processing fee.

That covers 132 hours of supervised training across five modules, extensive hands-on clinical practicums, and no required additional externships.

Both enrollment options are on the program page.
healingoasis.edu/acupuncture`,
    slides: [
      { kind: 'hook', num: '$200', big: 'holds a seat', sub: 'One of twenty, in the Fall 2026 class.' },
      { kind: 'stat', num: '$7,900', unit: '.24 balance', sub: 'By check. Card payments carry a 3.4% processing fee.', size: 200 },
      { kind: 'steps', kicker: 'Which buys', items: [
        { n: '01', t: '132 supervised hours', d: 'Across five modules.' },
        { n: '02', t: 'Hands-on practicums', d: 'Three or four students to one faculty member.' },
        { n: '03', t: 'No externships', d: 'No extra weeks away on top of the five.' },
      ] },
      { kind: 'lead', kicker: 'And', big: 'Both species', sub: 'Canine and equine, in the same program, for the same money.' },
      { kind: 'lead', kicker: 'After you finish', big: 'Unlimited<br>consultations', sub: 'With the program director, for as long as you want them.' },
      { kind: 'cta', big: 'No hidden<br>second course.', sub: 'The whole certificate, in five modules.' },
    ],
  },
  {
    id: 'C09_section-two', th: TH.cocoa, date: 'Friday, September 11',
    angle: 'Section Two — the hands-on one',
    caption: `Section Two is the one with your hands on a patient.

Emphasis on clinical hands-on practicums using models, specimens, and live canine and equine patients. Review of relevant anatomy. Presentation of channels and points on both canine and equine patients.

Pulse diagnosis. Tongue diagnosis. Needling technique. Improvement of palpation skills.

Face-to-face in Sturtevant, Wisconsin. October 14–18.
healingoasis.edu/acupuncture`,
    slides: [
      { kind: 'hook', img: 'hands-dog.jpg', pos: '52% 46%', big: 'Section Two.<br>Hands on.', sub: 'Face-to-face · October 14–18', size: 104 },
      { kind: 'lead', kicker: 'You practice on', big: 'Models, specimens,<br>and live patients', sub: 'Canine and equine, both.', size: 80 },
      { kind: 'steps', kicker: 'The four skills', items: [
        { n: '01', t: 'Pulse diagnosis', d: '' },
        { n: '02', t: 'Tongue diagnosis', d: '' },
        { n: '03', t: 'Needling technique', d: '' },
      ] },
      { kind: 'lead', kicker: 'And the fourth', big: 'Palpation', sub: 'Improvement of palpation skills — the one that only ever comes from repetition under supervision.', size: 150 },
      { kind: 'photo', img: 'needle-band.jpg', pos: '50% 44%', kicker: 'Alongside', big: 'Channels and points,<br>presented on patients', sub: 'Plus a review of the relevant anatomy.', size: 66 },
      { kind: 'cta', big: 'This is the week<br>it becomes real.', sub: 'Sturtevant, Wisconsin. October 14–18.' },
    ],
  },
  {
    id: 'C10_sections-three-four', th: TH.inkwell, date: 'Saturday, September 12',
    angle: 'Sections Three and Four — diagnosis and treatment planning',
    caption: `Sections Three and Four are where it becomes diagnosis.

These sections form the basis of understanding diagnosis, pathology, and treatment strategies from a Chinese Medicine point of view.

Expansion on point functions and their categories. Causes of disease. The 8 principles. The 4 inspections. Patterns. Five Element clearings and treatments. Pain. Channel theory. Treatment planning.

Online LIVE — December 9–13 and January 6–10.
healingoasis.edu/acupuncture`,
    slides: [
      { kind: 'hook', big: 'Sections<br>Three &amp; Four.', sub: 'Where it stops being vocabulary and becomes diagnosis.', size: 108 },
      { kind: 'steps', kicker: 'The frameworks', items: [
        { n: '8', t: 'principles', d: 'The diagnostic frame.' },
        { n: '4', t: 'inspections', d: 'How you gather what you need.' },
        { n: '\u2261', t: 'Patterns', d: 'What the findings add up to.' },
      ] },
      { kind: 'lead', kicker: 'Built on', big: 'Causes<br>of disease', sub: 'Diagnosis, pathology and treatment strategy from a Chinese Medicine point of view.', size: 100 },
      { kind: 'lead', kicker: 'Expanded here', big: 'Point functions<br>and categories', sub: 'The introductory ideas from Section One, taken considerably further.', size: 80 },
      { kind: 'steps', kicker: 'And then', items: [
        { n: '\u2192', t: 'Five Element clearings', d: 'And their treatments.' },
        { n: '\u2192', t: 'Channel theory', d: 'And pain.' },
        { n: '\u2192', t: 'Treatment planning', d: 'Putting all of it into an actual plan.' },
      ] },
      { kind: 'cta', big: 'Two sections.<br>Ten days.', sub: 'Online LIVE — December 9–13 and January 6–10.' },
    ],
  },
  {
    id: 'C11_section-five', th: TH.charcoal, date: 'Sunday, September 13',
    angle: 'Section Five — where you are evaluated',
    caption: `Section Five is where somebody watches you do it.

Wednesday — an initial evaluation of your skills. Thursday and Friday — hands-on activities and instruction aimed squarely at your own strengths and weaknesses. Saturday — final practical evaluations.

Additional topics include Guasha, E-Stim, B-12 injection of points, scanning the horse, and moxa.

Face-to-face in Sturtevant, Wisconsin. February 3–7, 2027.
healingoasis.edu/acupuncture`,
    slides: [
      { kind: 'hook', big: 'Section Five.<br>Somebody<br>watches you<br>do it.', sub: 'Face-to-face · February 3–7, 2027', size: 92 },
      { kind: 'steps', kicker: 'How the week runs', items: [
        { n: 'Wed', t: 'Initial evaluation', d: 'Of where your skills actually are.' },
        { n: 'Thu–Fri', t: 'Hands-on, aimed at you', d: 'Instruction addressing your strengths and weaknesses.' },
        { n: 'Sat', t: 'Final practical evaluation', d: '' },
      ] },
      { kind: 'lead', kicker: 'Not a certificate of attendance', big: 'You are<br>assessed', sub: 'Plus two cases in SOAP format, presented to the program director.', size: 108 },
      { kind: 'steps', kicker: 'Additional topics', items: [
        { n: '\u2192', t: 'Guasha', d: '' },
        { n: '\u2192', t: 'E-Stim', d: '' },
        { n: '\u2192', t: 'B-12 injection of points', d: '' },
      ] },
      { kind: 'lead', kicker: 'And two more', big: 'Moxa, and<br>scanning<br>the horse', sub: 'The last things you learn before the certificate is yours.', size: 82 },
      { kind: 'cta', big: 'Earned on<br>a Saturday.', sub: 'Section Five, February 3–7, 2027.' },
    ],
  },
  {
    id: 'C12_september-16', th: TH.clay, date: 'Monday, September 14',
    angle: 'Closing — every date, and the start',
    caption: `Module I begins September 16, 2026. Here is the whole calendar.

Section I — Sept 16–20, 2026 · Online LIVE
Section II — Oct 14–18, 2026 · Face-to-Face
Section III — Dec 9–13, 2026 · Online LIVE
Section IV — Jan 6–10, 2027 · Online LIVE
Section V — Feb 3–7, 2027 · Face-to-Face

132 supervised hours. Canine and equine. Twenty students. $200 holds a seat.
healingoasis.edu/acupuncture`,
    slides: [
      { kind: 'hook', big: 'September<br>16', sub: 'Section One begins. Online LIVE, Wednesday to Sunday.', size: 150 },
      { kind: 'steps', kicker: 'The whole calendar', items: [
        { n: 'I', t: 'Sept 16–20, 2026', d: 'Online LIVE' },
        { n: 'II', t: 'Oct 14–18, 2026', d: 'Face-to-face' },
        { n: 'III', t: 'Dec 9–13, 2026', d: 'Online LIVE' },
      ] },
      { kind: 'steps', kicker: 'And the last two', items: [
        { n: 'IV', t: 'Jan 6–10, 2027', d: 'Online LIVE' },
        { n: 'V', t: 'Feb 3–7, 2027', d: 'Face-to-face. Where you are evaluated.' },
      ] },
      { kind: 'stat', num: '20', unit: 'seats', sub: 'That is the maximum size of the class.' },
      { kind: 'photo', img: 'hero-horse.jpg', pos: '58% 44%', kicker: 'Both species', big: 'Canine<br>and equine', sub: '132 supervised hours across all five sections.' },
      { kind: 'cta', big: 'The circling<br>is nearly over.', sub: '$200 holds a seat.', foot: 'Sturtevant, Wisconsin · and Online LIVE from anywhere' },
    ],
  },
]
