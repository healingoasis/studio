// Forty teaching cards for the 2026 Homecoming Conference.
//
// Every one teaches a single real idea taken from the speaker synopses PDF
// published on healingoasis.edu, and credits the speaker who will teach it.
// The goal is curiosity: a practitioner should learn something from the card
// alone, and want the rest.
//
// kind: 'claim'  a flat statement, set large
//       'ask'    a question, then the turn
//       'versus' the correction — what it is not, then what it is
//       'list'   three things
//       'number' a figure carrying the idea
//       'case'   a short narrative

export const SPEAKERS = {
  brounts:   ['01_Sabrina_Brounts',    'Sabrina Brounts',    'DVM, MS, PhD, DACVS, DECVS, DACVSMR'],
  durham:    ['02_Matt_Durham',        'Matt Durham',        'DVM, DACVSMR'],
  greer:     ['03_Marthina_Greer',     'Marthina Greer',     'DVM, JD'],
  henry:     ['04_Travis_Henry',       'Travis Henry',       'DVM, DAVDC'],
  ihrke:     ['05_Amber_Ihrke',        'Amber Ihrke',        'DVM, CVSMT, DACVSMR'],
  linder:    ['06_Jessica_Linder',     'Jessica Linder',     'DVM, DACVIM-Neurology'],
  logiudice: ['07_Rosemary_LoGiudice', 'Rosemary LoGiudice', 'DVM, CVA, CVSMT, DACVSMR'],
  ludwig:    ['08_Brittany_Ludwig',    'Brittany Ludwig',    'DVM, CVSMT, CVMRT'],
  morauw:    ['09_Coralie_Morauw',     'Coralie Morauw',     'DVM, CVSMT'],
  nielsen:   ['10_John_Nielsen',       'John Nielsen',       'CVT, VTS-ECC & Phys. Therapy'],
  polmateer: ['11_Angela_Polmateer',   'Angela Polmateer',   'OTR, CHT'],
  thomovsky: ['12_Stephanie_Thomovsky','Stephanie Thomovsky','DVM, MS, DACVIM-Neurology'],
  tomlinson: ['13_Julia_Tomlinson',    'Julia Tomlinson',    'BVSc, MS, PhD, DACVS, DACVSMR'],
  wessum:    ['14_Rob_van_Wessum',     'Rob van Wessum',     'DVM, MS, DACVSMR'],
  yoquelet:  ['15_Rachel_Yoquelet',    'Rachel Yoquelet',    'BS, RVT, VTS (ECC), CVMRT'],
  rivera:    ['16_Pedro_Luis_Rivera',  'Pedro Luis Rivera',  'DVM, FACFN, DACVSMR, FCoAC'],
}

export const CARDS = [
  // ---- Sabrina Brounts · equine surgery and tendon rehabilitation ----
  { id: 'T01', by: 'brounts', kind: 'claim', pal: 'ox',
    big: 'Discharging a colic<br>patient is only<br>half the battle.',
    sub: 'The surgery can be a success and the road back to athletic function still be paved with hurdles.',
    tag: 'Beyond the Incision' },
  { id: 'T02', by: 'brounts', kind: 'list', pal: 'navy',
    lead: 'Three things that derail a post-colic horse',
    items: ['Incisional hernias', 'Peritoneal adhesions', 'Profound loss of abdominal core strength'],
    tag: 'Beyond the Incision' },
  { id: 'T03', by: 'brounts', kind: 'versus', pal: 'sand',
    not: 'Passive stall rest',
    is: 'Precise mechanical tension',
    sub: 'Tendon and ligament rehabilitation requires loading that remodels functional, elastic tissue.',
    tag: 'Elasticity Lost and Found' },
  { id: 'T04', by: 'brounts', kind: 'claim', pal: 'ink',
    big: 'Footing and incline<br>are treatment<br>variables.',
    sub: 'Not just where the horse happens to walk — things you manipulate deliberately across a progressive program.',
    tag: 'Elasticity Lost and Found' },

  // ---- Matt Durham · comparative nutrition ----
  { id: 'T05', by: 'durham', kind: 'claim', pal: 'clay',
    big: 'Horses and humans<br>run on different<br>energy systems.',
    sub: 'And on a surprising number of shared cellular pathways, directly and indirectly involved in performance.',
    tag: 'Two Species, One Goal' },

  // ---- Marthina Greer · reproduction and neurology ----
  { id: 'T06', by: 'greer', kind: 'ask', pal: 'bone',
    q: 'A bitch cannot deliver.<br>Where do you look first?',
    a: 'Neurological, orthopedic, gonadal pain, or behavioral — the answer decides everything that follows.',
    tag: 'Better Sex Through Neurology' },
  { id: 'T07', by: 'greer', kind: 'claim', pal: 'maroon',
    big: 'How you handle a<br>newborn pup can<br>shape its whole life.',
    sub: 'A series of structured, simple handling exercises — something you can hand straight to your breeders.',
    tag: 'Better Sex Through Neurology' },

  // ---- Travis Henry · dentistry ----
  { id: 'T08', by: 'henry', kind: 'claim', pal: 'navy',
    big: 'A performance<br>problem can start<br>in the mouth.',
    sub: 'Dental pathologies in the horse produce pain and inflammation that show up a long way from the teeth.',
    tag: 'TMJ and Dental Pathologies' },
  { id: 'T09', by: 'henry', kind: 'ask', pal: 'ox',
    q: 'What is the<br>stomatognathic system?',
    a: 'The mechanics of chewing and the neuroanatomy of the teeth — and, as the lecture title puts it, what they forgot to tell us.',
    tag: 'The Stomatognathic System' },

  // ---- Amber Ihrke · joints and cupping ----
  { id: 'T10', by: 'ihrke', kind: 'list', pal: 'sand',
    lead: 'Working up a canine shoulder',
    items: ['CT', 'Musculoskeletal ultrasound', 'Radiographs'],
    tag: 'Injuries to the Shoulder Joint' },
  { id: 'T11', by: 'ihrke', kind: 'list', pal: 'ink',
    lead: 'And then the plan has three parts',
    items: ['Regenerative medicine', 'Manual therapy', 'Exercise'],
    tag: 'Injuries to the Shoulder Joint' },
  { id: 'T12', by: 'ihrke', kind: 'versus', pal: 'clay',
    not: 'A folk remedy',
    is: 'Manual loading of tissue',
    sub: 'Cupping has a physiological process behind it, and indications and techniques worth knowing properly.',
    tag: 'Hands-On Healing' },
  { id: 'T13', by: 'ihrke', kind: 'claim', pal: 'bone',
    big: 'The elbow and<br>carpus deserve<br>their own workup.',
    sub: 'Case-based: diagnosis, therapeutic plan, and a defined return to function.',
    tag: 'Injuries to the Elbow &amp; Carpal Joints' },

  // ---- Jessica Linder · neurology ----
  { id: 'T14', by: 'linder', kind: 'claim', pal: 'maroon',
    big: 'Autoimmune neurologic<br>disease in dogs looks<br>like it does in us.',
    sub: 'What we are learning about the similarities across species is changing how these are approached.',
    tag: 'Inflammatory Neurologic Disease in Dogs' },
  { id: 'T15', by: 'linder', kind: 'ask', pal: 'navy',
    q: 'Weak, or<br>neurologically weak?',
    a: 'Differentiating the common neuromuscular diseases is most of the work. Treating them follows from that.',
    tag: 'Walk This Way… Or Not' },

  // ---- Rosemary LoGiudice · thermography and stance analysis ----
  { id: 'T16', by: 'logiudice', kind: 'versus', pal: 'ox',
    not: 'Diagnostic tools',
    is: 'Corroborating evidence',
    sub: 'Thermography and a stance analyzer do not diagnose. Used properly they help validate what your hands already found.',
    tag: 'Colors and Numbers' },
  { id: 'T17', by: 'logiudice', kind: 'claim', pal: 'sand',
    big: 'A stance analyzer<br>turns a hunch<br>into a number.',
    sub: 'Which is what makes it useful when you need to show an owner, or a colleague, what changed.',
    tag: 'Colors and Numbers' },

  // ---- Brittany Ludwig · kinesiology taping ----
  { id: 'T18', by: 'ludwig', kind: 'list', pal: 'ink',
    lead: 'What kinesiology tape is actually for',
    items: ['Pain reduction', 'Edema reduction', 'Altering proprioception and gait'],
    tag: 'Kinesiology Taping: What, Why, and How?' },
  { id: 'T19', by: 'ludwig', kind: 'claim', pal: 'clay',
    big: 'The pattern is<br>the prescription.',
    sub: 'Different patterns exist for different indications. Applying the wrong one is not a neutral act.',
    tag: 'Kinesiology Taping: What, Why, and How?' },
  { id: 'T20', by: 'ludwig', kind: 'ask', pal: 'bone',
    q: 'But does<br>it work?',
    a: 'A whole lecture on what the current literature actually demonstrates — and, just as usefully, where the research is missing.',
    tag: 'Kinesiology Taping: Current Research' },

  // ---- Coralie Morauw · rider and equine biomechanics ----
  { id: 'T21', by: 'morauw', kind: 'claim', pal: 'maroon',
    big: 'Ridden performance is<br>two biomechanics<br>interacting.',
    sub: 'The horse&rsquo;s and the rider&rsquo;s. You cannot fully assess one without looking at the other.',
    tag: 'Hold Your Horses' },
  { id: 'T22', by: 'morauw', kind: 'list', pal: 'navy',
    lead: 'Locomotion is not one movement',
    items: ['Cervical contribution', 'Thoracic and lumbar contribution', 'Pelvic contribution'],
    tag: 'Hold Your Horses' },
  { id: 'T23', by: 'morauw', kind: 'claim', pal: 'ox',
    big: 'An asymmetric rider<br>makes an asymmetric<br>horse.',
    sub: 'Weight distribution and movement patterns both shift — and the effect differs across work scenarios.',
    tag: 'Hold Your Horses' },
  { id: 'T24', by: 'morauw', kind: 'versus', pal: 'sand',
    not: 'Acute loading',
    is: 'Chronic loading',
    sub: 'Two different problems, especially in a horse that already has underlying pathology.',
    tag: 'Hold Your Horses' },
  { id: 'T25', by: 'morauw', kind: 'claim', pal: 'ink',
    big: 'Tack fit is a<br>clinical variable.',
    sub: 'So is rider position. Both belong in the plan, not in the conversation afterwards.',
    tag: 'Hold Your Horses' },

  // ---- John Nielsen · conditioning from human performance models ----
  { id: 'T26', by: 'nielsen', kind: 'claim', pal: 'clay',
    big: 'In human sport,<br>shoulder conditioning<br>is not optional.',
    sub: 'Overhead athletes train scapular stability, eccentric control and force absorption with ruthless specificity.',
    tag: 'Scapular Strength and Deceleration Control' },
  { id: 'T27', by: 'nielsen', kind: 'versus', pal: 'bone',
    not: 'Treating the shoulder after it goes',
    is: 'Conditioning it before',
    sub: 'Proactive work on the scapular stabilizers and decelerators reduces overload in jumping and tight turns.',
    tag: 'Scapular Strength and Deceleration Control' },
  { id: 'T28', by: 'nielsen', kind: 'claim', pal: 'maroon',
    big: 'The lumbopelvic-hip<br>complex is the engine.',
    sub: 'It transfers force from the ground to the limb. In sprinters, and in your canine athletes.',
    tag: 'The Engine Room' },
  { id: 'T29', by: 'nielsen', kind: 'list', pal: 'navy',
    lead: 'These three often share one root cause',
    items: ['Iliopsoas strain', 'Recurrent hamstring problems', 'Lumbosacral pain'],
    tag: 'The Engine Room' },
  { id: 'T30', by: 'nielsen', kind: 'list', pal: 'ox',
    lead: 'Conditioning variables you can actually measure',
    items: ['Load and volume', 'Rest intervals and neuromuscular timing', 'Fatigue management'],
    tag: 'The Engine Room' },

  // ---- Polmateer + Thomovsky · brachial plexus, team taught ----
  { id: 'T31', by: 'polmateer', kind: 'claim', pal: 'sand',
    big: 'A hand therapist and<br>a veterinary neurologist<br>teach this one together.',
    sub: 'Brachial plexus injury in people and in small animals, taught side by side across both species.',
    tag: 'Brachial Plexus Injuries', co: 'thomovsky' },
  { id: 'T32', by: 'thomovsky', kind: 'list', pal: 'ink',
    lead: 'Brachial plexus injury, compared across species',
    items: ['Types of injury', 'Diagnosis', 'Pathophysiology'],
    tag: 'Brachial Plexus Injuries' },
  { id: 'T33', by: 'thomovsky', kind: 'claim', pal: 'clay',
    big: 'Then a second hour<br>on what to actually<br>do about it.',
    sub: 'Treatment options, with the focus on rehabilitation.',
    tag: 'Brachial Plexus Injuries' },

  // ---- Julia Tomlinson · spinal motion and fascia ----
  { id: 'T34', by: 'tomlinson', kind: 'list', pal: 'bone',
    lead: 'Spinal motion has four components',
    items: ['Torsion', 'Lateral bending', 'Flexion and extension'],
    tag: 'Canine Spinal Motion for Bipeds' },
  { id: 'T35', by: 'tomlinson', kind: 'claim', pal: 'maroon',
    big: 'Stabilizing a quadruped<br>spine means targeting<br>specific muscles.',
    sub: 'Not general core work. The ones research shows are actually involved in stability.',
    tag: 'Canine Spinal Motion for Bipeds' },
  { id: 'T36', by: 'tomlinson', kind: 'claim', pal: 'navy',
    big: 'There is a fascial line<br>in the dog that was<br>only recently found.',
    sub: 'Which is a reasonable hint that &ldquo;just trigger points&rdquo; was never the whole picture.',
    tag: 'Not Just Trigger Points' },

  // ---- Rob van Wessum · equine back ----
  { id: 'T37', by: 'wessum', kind: 'case', pal: 'ox',
    lead: 'A case that did not behave',
    body: 'Back problems with treatable pathology on the first look. No improvement on the standard protocol. More diagnostics found extensive pathology <em>inside the spinal canal</em> — confirmed at necropsy.',
    tag: 'When Unimaginable Pathology and Rehabilitation Meet' },
  { id: 'T38', by: 'wessum', kind: 'claim', pal: 'ink',
    big: 'Kissing spines is more<br>complex than most<br>people realize.',
    sub: 'What happens when the bridge between the front and hind ends starts to cave in — and what that means for diagnosis and rehab.',
    tag: 'Kissing Spines or Kidding Spines?' },
  { id: 'T39', by: 'wessum', kind: 'versus', pal: 'sand',
    not: 'Change that is old and quiet',
    is: 'Inflammation that is active now',
    sub: 'Power Doppler in equine musculoskeletal ultrasound lets you tell them apart — and fine-tune treatment accordingly.',
    tag: 'The Use of Power Doppler' },

  // ---- Rachel Yoquelet · geriatric rehabilitation ----
  { id: 'T40', by: 'yoquelet', kind: 'claim', pal: 'clay',
    big: 'In older people, exercise<br>protects the mind<br>as well as the body.',
    sub: 'The studies are there. The lecture asks what that means for your geriatric canine patients, and how early to start.',
    tag: 'Making the Golden Years Count' },
]
