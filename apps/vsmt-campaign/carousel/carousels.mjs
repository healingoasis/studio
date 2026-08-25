// VSMT — IDL-Hybrid Veterinary Spinal Manipulative Therapy.
// Twelve carousels, six slides each: 72 images.
//
// Facts from healingoasis.edu/vsmt-certification-program, checked 2026-08-25.
// Faculty roles cross-checked against the faculty page. Nothing here repeats an
// angle from the conference, acupuncture or VMRT campaigns, and no photograph
// is shared with any of them — sources are tracked in img/_sources.json.
import { C } from './kit.mjs'

const veilDark = 'linear-gradient(180deg,rgba(12,14,20,0.76) 0%,rgba(12,14,20,0.30) 34%,rgba(12,14,20,0.56) 66%,rgba(12,14,20,0.92) 100%)'
const veilSoft = 'linear-gradient(180deg,rgba(12,14,20,0.62) 0%,rgba(12,14,20,0.16) 40%,rgba(12,14,20,0.80) 100%)'
const ON = '#bcd0ee'

const TH = {
  maroon:  { bg: C.maroon,  ink:'#fff',   sub:'rgba(245,236,223,0.86)', accent:'#bcd0ee', tone:'light', rule:'rgba(245,236,223,0.26)', veil:veilSoft, accentOn:ON },
  navy:    { bg:'#1e2c45',  ink:'#fff',   sub:'rgba(226,235,248,0.84)', accent:'#e8dcc8', tone:'light', rule:'rgba(226,235,248,0.26)', veil:veilDark, accentOn:ON, ctaInk:'#1e2c45' },
  paper:   { bg: C.paper,   ink: C.ink,   sub: C.muted,                 accent:'#2f4670', tone:'dark',  rule:'rgba(47,70,112,0.20)',   veil:veilSoft, accentOn:ON },
  night:   { bg:'#101319',  ink:'#fff',   sub:'rgba(226,235,248,0.78)', accent:'#7fa3d8', tone:'light', rule:'rgba(226,235,248,0.22)', veil:veilDark, accentOn:ON },
  bone:    { bg:'#f2f0ea',  ink:'#1b2029',sub:'#5c6472',                accent:'#2f4670', tone:'dark',  rule:'rgba(27,32,41,0.14)',    veil:veilSoft, accentOn:ON },
  oxblood: { bg:'#3d0505',  ink: C.cream, sub:'rgba(245,236,223,0.82)', accent:'#a8c0e4', tone:'light', rule:'rgba(245,236,223,0.22)', veil:veilDark, accentOn:ON, ctaInk:'#3d0505' },
  slate:   { bg:'#dfe3ea',  ink:'#1b2029',sub:'#5c6472',                accent:'#8f2f2f', tone:'dark',  rule:'rgba(27,32,41,0.16)',    veil:veilSoft, accentOn:ON },
  ink:     { bg:'#0d1016',  ink:'#fff',   sub:'rgba(255,255,255,0.76)', accent:'#7fa3d8', tone:'light', rule:'rgba(255,255,255,0.18)', veil:veilDark, accentOn:ON },
  clay:    { bg:'#5c3a52',  ink:'#fff',   sub:'rgba(250,240,248,0.86)', accent:'#dbe4f2', tone:'light', rule:'rgba(255,255,255,0.24)', veil:veilSoft, accentOn:ON, ctaInk:'#5c3a52' },
  deep:    { bg:'#182233',  ink:'#fff',   sub:'rgba(226,235,248,0.82)', accent:'#e8dcc8', tone:'light', rule:'rgba(226,235,248,0.24)', veil:veilDark, accentOn:ON, ctaInk:'#182233' },
  linen:   { bg:'#eeeae2',  ink:'#2f4670',sub:'#5c6472',                accent:'#8f2f2f', tone:'dark',  rule:'rgba(47,70,112,0.20)',   veil:veilSoft, accentOn:ON },
  charcoal:{ bg:'#1d2027',  ink: C.cream, sub:'rgba(226,235,248,0.76)', accent:'#7fa3d8', tone:'light', rule:'rgba(226,235,248,0.20)', veil:veilDark, accentOn:ON },
}

// Each used exactly once; sources verified distinct in img/_sources.json.
// Conference exhibit-hall and vendor-table shots are deliberately excluded —
// they are not VSMT and would misrepresent the program.
export const POOL = [
  's-close1.jpg','s-lecture6.jpg','s-boxer.jpg','s-lecture12.jpg','s-close2.jpg','s-lecture1.jpg',
  's-faculty.jpg','s-lecture8.jpg','s-close3.jpg','s-lecture11.jpg','s-dog1.jpg','s-lecture3.jpg',
  's-award.jpg','s-lecture13.jpg','s-dog4.jpg','s-lecture10.jpg','s-lecture2.jpg','s-dog2.jpg',
  's-lecture14.jpg','s-lecture5.jpg','s-dog5.jpg','s-lecture9.jpg','s-suit.jpg','s-lecture4.jpg',
  's-arena1.jpg','s-lecture7.jpg','s-dog3.jpg','s-arena2.jpg','s-arena3.jpg',
]

export const CAROUSELS = [
  {
    id: 'S01_226-hours', th: TH.navy, date: 'Wednesday, August 26',
    angle: 'The size of it — 226 hours',
    caption: `226 hours of supervised postgraduate education. It is the largest program we run.

Five modules: one off-campus Interactive Distance Learning module — prerecorded video plus scheduled live webinars — and four face-to-face modules on campus.

Well over 100 of those hours are supervised clinical hands-on lab, under direct supervision. And no external externship is required.

2027 Spring and Fall classes are both open.
healingoasis.edu`,
    slides: [
      { kind: 'hook', num: '226', big: 'hours of<br>supervised education', sub: 'The largest program we teach.' },
      { kind: 'stat', num: '5', unit: 'modules', sub: 'One off-campus, four face-to-face on campus.' },
      { kind: 'stat', num: '100+', unit: 'hands-on hours', sub: 'Well over a hundred hours of supervised clinical lab, under direct supervision.', size: 210 },
      { kind: 'lead', kicker: 'And still', big: 'No external<br>externship', sub: 'All clinical and practical work is inside the program.' },
      { kind: 'lead', kicker: 'Emphasis', big: 'Functional &amp;<br>clinical neurology', sub: 'Small and large animals — canine and equine both.', size: 80 },
      { kind: 'cta', big: '226 hours.<br>Five modules.', sub: '2027 Spring and Fall are both open.' },
    ],
  },
  {
    id: 'S02_idl-hybrid', th: TH.bone, date: 'Friday, August 28',
    angle: 'How the hybrid actually works',
    caption: `One module of this program never asks you to travel.

Module I is Interactive Distance Learning — prerecorded educational videos plus scheduled live webinars, beginning the moment you enter the Moodle student section. Modules II to V are face-to-face on campus.

Two further two-hour webinars are scheduled between modules to help you integrate what you have covered.

You will need a high-speed connection and a computer with a camera and microphone.
healingoasis.edu`,
    slides: [
      { kind: 'hook', big: 'One module<br>never moves you.', sub: 'Module I is Interactive Distance Learning.', size: 112 },
      { kind: 'steps', kicker: 'What Module I is', items: [
        { n: '01', t: 'Prerecorded video', d: 'Asynchronous, in your own time.' },
        { n: '02', t: 'Scheduled live webinars', d: 'Synchronous, with faculty.' },
        { n: '03', t: 'Starts on Moodle', d: 'It begins the moment you enter the student section.' },
      ] },
      { kind: 'lead', kicker: 'Then', big: 'Four modules<br>face-to-face', sub: 'Wednesday 1:00 PM until Sunday 12:30 PM, on campus.' },
      { kind: 'lead', kicker: 'And between them', big: 'Two webinars,<br>two hours each', sub: 'Scheduled to help you integrate what was presented.', size: 84 },
      { kind: 'steps', kicker: 'What you will need', items: [
        { n: '→', t: 'A high-speed connection', d: '' },
        { n: '→', t: 'A computer with camera and microphone', d: '' },
      ] },
      { kind: 'cta', big: 'Distance learning,<br>then hands.', sub: '2027 Spring and Fall are both open.' },
    ],
  },
  {
    id: 'S03_neurology', th: TH.night, date: 'Sunday, August 30',
    angle: 'The emphasis — functional and clinical neurology',
    caption: `The emphasis of this program is functional and clinical neurology.

That is what separates VSMT from a technique course. You are not learning a set of adjustments — you are learning the neurology underneath them, applied to small and large animals.

Species content includes both canine and equine. 226 hours, five modules, and well over 100 hours of supervised hands-on lab.

healingoasis.edu`,
    slides: [
      { kind: 'hook', big: 'Functional and<br>clinical neurology.', sub: 'That is the emphasis of this program.', size: 96 },
      { kind: 'lead', kicker: 'Which means', big: 'Not a<br>technique course', sub: 'You learn the neurology underneath the adjustment, not just the adjustment.' },
      { kind: 'lead', kicker: 'Applied to', big: 'Small and<br>large animals', sub: 'Species content includes both canine and equine.' },
      { kind: 'stat', num: '226', unit: 'hours', sub: 'Postgraduate education, supervised throughout.' },
      { kind: 'lead', kicker: 'And to be clear', big: 'Two SOAP cases,<br>evaluated', sub: 'Presented during Module IV or V. This is assessed work.', size: 82 },
      { kind: 'cta', big: 'Understand it,<br>then do it.', sub: '2027 Spring and Fall are both open.' },
    ],
  },
  {
    id: 'S04_who-can-enroll', th: TH.paper, date: 'Tuesday, September 1',
    angle: 'Eligibility — including final-year students',
    caption: `Who this program is open to.

Licensed chiropractors and licensed veterinarians in good standing with their respective licensing boards.

And — this is the part people miss — current chiropractic and veterinary students who are on, or registering for, their last trimester or semester.

If you are finishing school, you do not have to wait.
healingoasis.edu`,
    slides: [
      { kind: 'hook', big: 'Two professions.<br>One program.', sub: 'Licensed chiropractors and licensed veterinarians.', size: 108 },
      { kind: 'lead', kicker: 'In both cases', big: 'In good standing<br>with your board', sub: 'That is the requirement, and it is the whole requirement.' },
      { kind: 'lead', kicker: 'And the part people miss', big: 'Final-year<br>students qualify', sub: 'Current chiropractic and veterinary students on, or registering for, their last trimester or semester.', size: 88 },
      { kind: 'lead', kicker: 'Which means', big: 'You do not<br>have to wait', sub: 'You can start this before you have finished school.' },
      { kind: 'stat', num: '20', unit: 'students max', sub: 'And three or four students to one faculty member for clinical hands-on.' },
      { kind: 'cta', big: 'Check before<br>you rule it out.', sub: 'info@healingoasis.edu · 262-898-1680' },
    ],
  },
  {
    id: 'S05_the-textbooks', th: TH.oxblood, date: 'Thursday, September 3',
    angle: 'Two instructors wrote the textbooks',
    caption: `Two of the people teaching you wrote the books you will study from.

Gregory Cramer, DC, PhD — Professor of Basic Sciences and Dean of Research at National University of Health Sciences, teaching here since 2002 — co-authored Basic Clinical Anatomy of the Spine, Spinal Cord, and ANS.

Douglas Gould, PhD — Chair of Foundational Medical Studies at Oakland University William Beaumont School of Medicine — is an editor of Nolte's The Human Brain: An Introduction to its Functional Anatomy.

Both are on the VSMT reading list. Both are in the room.
healingoasis.edu`,
    slides: [
      { kind: 'hook', num: '2', big: 'of your instructors<br>wrote the textbooks', sub: 'The ones on your own reading list.' },
      { kind: 'quad', kicker: 'Adjunct faculty', people: [
        ['cramer','Gregory Cramer','DC, PhD · teaching here since 2002'],
        ['gould','Douglas Gould','PhD · Oakland University'],
      ] },
      { kind: 'lead', kicker: 'Cramer co-authored', big: 'Basic Clinical<br>Anatomy of the<br>Spine and ANS', sub: 'Cramer &amp; Darby, 3rd Edition, Mosby. On the VSMT reading list.', size: 72 },
      { kind: 'lead', kicker: 'Gould edited', big: 'Nolte&rsquo;s<br>The Human Brain', sub: 'An Introduction to its Functional Anatomy, 7th Edition. Also on the list.', size: 82 },
      { kind: 'steps', kicker: 'Alongside', items: [
        { n: '→', t: 'Miller&rsquo;s Anatomy of the Dog', d: 'Evans, 4th Ed.' },
        { n: '→', t: 'Veterinary Neuroanatomy and Clinical Neurology', d: 'de Lahunta &amp; Glass, 3rd Ed.' },
        { n: '→', t: 'Foundations of Chiropractic &mdash; Subluxation', d: 'Gatterman, 2nd Ed.' },
      ] },
      { kind: 'cta', big: 'Taught by<br>the authors.', sub: '2027 Spring and Fall are both open.' },
    ],
  },
  {
    id: 'S06_the-faculty', th: TH.slate, date: 'Saturday, September 5',
    angle: 'Who teaches VSMT',
    caption: `Nine full-time faculty, plus adjuncts.

Michelle Rivera — MT, VDT, CVMRT (Program Director)
Pedro Luis Rivera — DVM, FACFN, DACVSMR, FCoAC (Program Director)
Rosemary LoGiudice — DVM, DACVSMR, CVA, CCRT, CVSMT, FCoAC (Senior Faculty)
Lynne Dennis — DVM, CVA, FAAVA, CVSMT, CVMRT
Coralie Morauw — DVM, CVSMT
Kristina Mott — DVM, CVSMT, CVA, CCRT
Marcus Wisniewski — DVM, CVSMT, FCoAC
Carly Yaeger-Koykkari — DC, CVSMT
Deanne Zenoni — DVM, CVA, CVSMT, CVMRT

Adjunct: Gregory Cramer DC PhD, Douglas Gould PhD, Stephanie Thomovsky DVM MS DACVIM-Neurology.
healingoasis.edu`,
    slides: [
      { kind: 'hook', num: '9', big: 'full-time faculty,<br>plus adjuncts', sub: 'Three or four students to one of them, for hands-on.' },
      { kind: 'quad', kicker: 'Program directors and senior faculty', people: [
        ['michelle','Michelle Rivera','Program Director'],
        ['pedro','Pedro Luis Rivera','Program Director'],
        ['logiudice','Rosemary LoGiudice','Senior Faculty'],
        ['dennis','Lynne Dennis','DVM, FAAVA, CVSMT'],
      ] },
      { kind: 'quad', kicker: 'Full-time faculty', people: [
        ['morauw','Coralie Morauw','DVM, CVSMT'],
        ['mott','Kristina Mott','DVM, CVSMT, CVA'],
        ['wisniewski','Marcus Wisniewski','DVM, CVSMT, FCoAC'],
        ['yaeger','Carly Yaeger-Koykkari','DC, CVSMT'],
      ] },
      { kind: 'quad', kicker: 'And adjunct faculty', people: [
        ['zenoni','Deanne Zenoni','DVM, CVA, CVSMT'],
        ['thomovsky','Stephanie Thomovsky','Neurology'],
      ] },
      { kind: 'lead', kicker: 'Hands-on is', big: 'Under direct<br>supervision', sub: 'Well over 100 hours of it, across the four face-to-face modules.' },
      { kind: 'cta', big: 'Twelve of them.<br>Twenty of you.', sub: '2027 Spring and Fall are both open.' },
    ],
  },
  {
    id: 'S07_module-week', th: TH.charcoal, date: 'Monday, September 7',
    angle: 'What a face-to-face module is like',
    caption: `What a face-to-face module actually looks like.

Wednesday 1:00 PM through Sunday 12:30 PM. Four of them, across roughly three months.

Between each one you set time aside to study, practice and integrate — this is a postgraduate program and it expects that of you. Two scheduled webinars help.

Well over 100 hours of supervised clinical hands-on lab across the four.
healingoasis.edu`,
    slides: [
      { kind: 'hook', big: 'Wednesday one,<br>to Sunday half<br>past twelve.', sub: 'Four times, on campus.', size: 92 },
      { kind: 'stat', num: '4', unit: 'face-to-face modules', sub: 'Across roughly three months, plus the distance module before them.', size: 220 },
      { kind: 'lead', kicker: 'Between each one', big: 'Study.<br>Practice.<br>Integrate.', sub: 'A postgraduate program expects that, and this one says so plainly.' },
      { kind: 'lead', kicker: 'To help with that', big: 'Two scheduled<br>webinars', sub: 'Two hours each, between modules.' },
      { kind: 'stat', num: '100+', unit: 'hands-on hours', sub: 'Supervised clinical lab, spread across the four face-to-face modules.', size: 200 },
      { kind: 'cta', big: 'Four weeks<br>on campus.', sub: 'Plus the distance module, and the work between.' },
    ],
  },
  {
    id: 'S08_class-size', th: TH.ink, date: 'Wednesday, September 9',
    angle: 'Twenty students, and the ratio',
    caption: `Twenty students. That is the maximum.

For clinical hands-on practicums we hold the ratio to three or four students per faculty member. With well over 100 hours of hands-on lab, that ratio is the whole difference between watching and doing.

The program provides an outstanding student-to-faculty ratio — and it is the number we would ask you to compare first.

healingoasis.edu`,
    slides: [
      { kind: 'hook', num: '20', big: 'students.<br>Maximum.', sub: 'Not a target. A cap.' },
      { kind: 'stat', num: '3–4', unit: 'to one', sub: 'The ratio held for clinical hands-on practicums.' },
      { kind: 'lead', kicker: 'Across', big: '100+ hours<br>of hands-on', sub: 'Which is where a ratio stops being a statistic and starts being your afternoon.' },
      { kind: 'lead', kicker: 'The honest version', big: 'Compare this<br>number first', sub: 'Before cost, before anything. It decides what you actually get.' },
      { kind: 'stat', num: '226', unit: 'hours', sub: 'Total supervised education across the five modules.' },
      { kind: 'cta', big: 'Twenty seats,<br>three classes.', sub: '2027 Spring and Fall are both open.' },
    ],
  },
  {
    id: 'S09_what-it-costs', th: TH.linen, date: 'Friday, September 11',
    angle: 'The money',
    caption: `$8,389 for the IDL-Hybrid VSMT program.

A $200 deposit holds your place. Payment by check or money order drawn on a US bank account, cash, or MasterCard and Visa — card transactions carry a 3.4% charge.

That covers 226 hours of supervised education, well over 100 hours of hands-on clinical lab, all clinical and practical work, and no external externship.

healingoasis.edu`,
    slides: [
      { kind: 'hook', num: '$8,389', big: 'the whole<br>program', sub: 'Five modules. 226 hours.', size: 100 },
      { kind: 'stat', num: '$200', unit: 'deposit', sub: 'Holds your place in whichever class you choose.' },
      { kind: 'steps', kicker: 'Which covers', items: [
        { n: '01', t: '226 hours of supervised education', d: 'Across five modules.' },
        { n: '02', t: '100+ hours of hands-on lab', d: 'Under direct supervision.' },
        { n: '03', t: 'No external externship', d: 'All clinical and practical work included.' },
      ] },
      { kind: 'lead', kicker: 'How to pay', big: 'Check, cash,<br>or card', sub: 'US bank accounts only. Card transactions carry a 3.4% charge.' },
      { kind: 'lead', kicker: 'Worth weighing', big: 'Time away from<br>your practice', sub: 'Four weeks on campus, and one module you never travel for.', size: 84 },
      { kind: 'cta', big: 'One price.<br>Five modules.', sub: '$200 holds your place.' },
    ],
  },
  {
    id: 'S10_three-classes', th: TH.deep, date: 'Sunday, September 13',
    angle: 'Every date for both open classes',
    caption: `Two classes are open. Here is every date.

2027 SPRING CLASS
Module I (off-campus) Jan 13–17 · Module II Feb 24–28 · Module III Mar 17–21 · Module IV Apr 14–18 · Module V May 12–16

2027 FALL CLASS
Module I (off-campus) Aug 11–15 · Module II Sept 15–19 · Module III Oct 13–17 · Module IV Nov 10–14 · Module V Dec 8–12

Face-to-face modules run Wednesday 1:00 PM to Sunday 12:30 PM. Screenshot this one.
healingoasis.edu`,
    slides: [
      { kind: 'hook', num: '2', big: 'classes<br>open now', sub: '2027 Spring and 2027 Fall. Screenshot this one.' },
      { kind: 'steps', kicker: '2027 Spring class', items: [
        { n: 'I', t: 'Jan 13–17, 2027', d: 'Off-campus, Interactive Distance Learning.' },
        { n: 'II', t: 'Feb 24–28, 2027', d: 'On campus.' },
        { n: 'III', t: 'Mar 17–21, 2027', d: 'Modules IV and V follow in April and May.' },
      ] },
      { kind: 'steps', kicker: '2027 Fall class', items: [
        { n: 'I', t: 'Aug 11–15, 2027', d: 'Off-campus.' },
        { n: 'II', t: 'Sept 15–19, 2027', d: 'On campus.' },
        { n: 'III', t: 'Oct 13–17, 2027', d: 'Modules IV and V follow in November and December.' },
      ] },
      { kind: 'lead', kicker: 'Every face-to-face module', big: 'Wed 1:00 PM to<br>Sun 12:30 PM', sub: 'Four of them per class.', size: 78 },
      { kind: 'lead', kicker: 'And before all of it', big: 'Module I starts<br>on Moodle', sub: 'The moment you enter the student section.' },
      { kind: 'cta', big: 'Pick the one<br>that fits.', sub: '$200 holds your place in either.' },
    ],
  },
  {
    id: 'S11_after-graduation', th: TH.clay, date: 'Tuesday, September 15',
    angle: 'What graduates keep — including the film archive',
    caption: `What every successful graduate receives.

Unlimited access to consultations with the program director. A listing in the Find a Graduate / Alumni section. Access to the ALUMNI archive, which holds every explanation and technique film shown during the program — so the whole course stays available to you afterwards.

A percentage discount on CE seminars and the yearly conference. And 10% off if you send an associate or credentialed technician to the VMRT program.

healingoasis.edu`,
    slides: [
      { kind: 'hook', big: 'The films<br>stay yours.', sub: 'Along with three other things.', size: 118 },
      { kind: 'lead', kicker: 'The archive', big: 'Every explanation<br>and technique film', sub: 'Shown during the program, kept in the ALUMNI section for you afterwards.', size: 76 },
      { kind: 'lead', kicker: 'And', big: 'Unlimited<br>consultations', sub: 'With the program director. No time limit on that word.' },
      { kind: 'lead', kicker: 'Plus', big: 'Listed as<br>a graduate', sub: 'In the Find a Graduate / Alumni section.' },
      { kind: 'steps', kicker: 'And two discounts', items: [
        { n: '→', t: 'CE seminars and the yearly conference', d: 'A percentage off, as a graduate.' },
        { n: '→', t: '10% off the VMRT program', d: 'For an associate or credentialed technician you send.' },
      ] },
      { kind: 'cta', big: 'The course does<br>not close.', sub: '2027 Spring and Fall are both open.' },
    ],
  },
  {
    id: 'S12_closing', th: TH.maroon, date: 'Thursday, September 17',
    angle: 'Closing — the whole program in one swipe',
    caption: `IDL-Hybrid Veterinary Spinal Manipulative Therapy.

226 hours of supervised postgraduate education. Five modules — one at distance, four face-to-face. Well over 100 hours of supervised hands-on clinical lab. Emphasis on functional and clinical neurology, canine and equine.

Open to licensed chiropractors and veterinarians, and to chiropractic and veterinary students in their final semester.

$8,389, with $200 holding your place. 2027 Spring and Fall classes are both open.

info@healingoasis.edu · 262-898-1680 · healingoasis.edu`,
    slides: [
      { kind: 'hook', big: 'Veterinary Spinal<br>Manipulative<br>Therapy', sub: 'IDL-Hybrid. Postgraduate. 226 hours.', size: 88 },
      { kind: 'stat', num: '226', unit: 'hours', sub: 'Five modules — one at distance, four face-to-face on campus.' },
      { kind: 'lead', kicker: 'Emphasis', big: 'Functional &amp;<br>clinical neurology', sub: 'Canine and equine. Small and large animals.', size: 80 },
      { kind: 'lead', kicker: 'Open to', big: 'Chiropractors<br>and vets', sub: 'Licensed, in good standing — and final-semester students too.' },
      { kind: 'stat', num: '$200', unit: 'holds a place', sub: 'Tuition is $8,389 for the whole program.' },
      { kind: 'cta', big: 'Two classes.<br>Both open.', sub: 'info@healingoasis.edu · 262-898-1680', foot: '2027 Spring · 2027 Fall · Sturtevant, Wisconsin' },
    ],
  },
]
