// Shared: the school's ink, its two typefaces, the canvas size. Nothing else.
// The accent is brass rather than the conference campaign's ember, so the two
// campaigns read as siblings and never as the same thing.
export const FONTS = 'https://fonts.googleapis.com/css2?family=Bitter:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Manrope:wght@400;500;600;700;800&display=swap'

export const C = {
  maroon: '#5c0101',
  deep:   '#2b0606',
  night:  '#1a0808',
  ink:    '#2a1512',
  cream:  '#f5ecdf',
  paper:  '#faf6ef',
  brass:  '#a87b2e',
  muted:  '#6b5550',
}

// Every fact below is quoted from healingoasis.edu/acupuncture, checked 2026-08-24.
export const P = {
  name:    'Veterinary Acupuncture',
  full:    'Veterinary Acupuncture Certificate Professional Enhancement Program',
  hours:   '132',
  modules: 5,
  cap:     20,
  ratio:   '3–4 students to one faculty member',
  species: 'Canine and Equine',
  place:   'Sturtevant, Wisconsin',
  url:     'healingoasis.edu/acupuncture',
  deposit: '$200',
  balance: '$7,900.24',
  starts:  'September 16, 2026',
  schedule: [
    ['I',   'Sept 16–20, 2026',  'Virtual-Live'],
    ['II',  'Oct 14–18, 2026',   'Face-to-Face'],
    ['III', 'Dec 9–13, 2026',    'Virtual-Live'],
    ['IV',  'Jan 6–10, 2027',    'Virtual-Live'],
    ['V',   'Feb 3–7, 2027',     'Face-to-Face'],
  ],
  faculty: [
    ['halden',   'Daniel Halden',  'DC, MAc, LAc, Dipl.Ac (NCCAOM), PAK, CAC, CVMRT'],
    ['dennis',   'Lynne Dennis',   'DVM, CVA, FAAVA, CVSMT, CVMRT'],
    ['gnadt',    'Victoria Gnadt', 'DVM, CVSMT, CVA'],
    ['michelle', 'Michelle Rivera','MT, VDT'],
    ['pedro',    'Pedro Rivera',   'DVM, FACFN, DACVSMR, FCoAC'],
  ],
}

export const page = (body, bg) => `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
<style>
  html, body { margin:0; padding:0; background:${bg}; }
  * { box-sizing:border-box; }
  .stage { width:1080px; height:1350px; position:relative; overflow:hidden; background:${bg};
           font-family:'Manrope','Helvetica Neue',Arial,sans-serif; }
  h1,h2,p { margin:0; }
</style>
</head>
<body><div class="stage">
${body}
</div></body>
</html>
`

// Two small pieces repeat because they are identity, not layout: the mark and
// the closing line. Everything else on every post is drawn from scratch.
export const mark = (tone = 'light', extra = '') => `
  <div style="display:flex; align-items:center; gap:14px;">
    <div style="width:48px; height:48px; border-radius:50%; background:${C.cream}; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
      <img src="../img/logo.png" alt="" style="width:40px; display:block;">
    </div>
    <div style="font-size:15px; font-weight:800; letter-spacing:0.21em; text-transform:uppercase; line-height:1.45; color:${tone === 'light' ? '#fff' : C.maroon};">
      Healing Oasis Wellness Center${extra}
    </div>
  </div>`
