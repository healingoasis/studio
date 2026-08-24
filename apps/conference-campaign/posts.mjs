// The campaign, as data. Every fact here was checked against
// healingoasis.edu/conference-2026/attend on 2026-08-24.
//
// theme  'dark'  = maroon panel, cream type, cream action bar
//        'light' = cream panel, dark type, maroon action bar
// block  {type:'stats'|'rows'|'duo', items:[...]}
// caption = the Facebook post text that goes with the image

export const CONF = {
  dates: 'Oct 23–25, 2026',
  place: 'Lombard, Illinois',
  url: 'healingoasis.edu/conference-2026/attend',
  closes: 'Registration closes Oct 12',
}

export const POSTS = [
  {
    id: '01-open', date: 'Tuesday, August 25', theme: 'dark', image: '01-open.jpg',
    kicker: 'Registration is open',
    headline: 'Resilience in Motion',
    size: 88,
    body: 'Comparative Rehabilitation &amp; Manual Therapies for All Beings. Three days of integrative learning with leading voices in veterinary rehabilitation, sports medicine and manual therapy.',
    block: { type: 'stats', items: [
      { value: '3', label: 'days, Friday to Sunday' },
      { value: '16', label: 'speakers' },
      { value: '20', label: 'CE contact hours max' },
    ] },
    caption: `Registration is open for the 2026 Healing Oasis Conference.

Resilience in Motion — Comparative Rehabilitation & Manual Therapies for All Beings. October 23–25 at National University of Health Sciences in Lombard, Illinois.

Three days, sixteen speakers, and up to 20 CE contact hours. Attend in person or join the live stream from anywhere — the CE credit is the same either way.

Register: https://healingoasis.edu/conference-2026/attend`,
  },
  {
    id: '02-twoways', date: 'Friday, August 28', theme: 'light', image: '02-twoways.jpg',
    kicker: 'Two ways to attend',
    headline: 'Be in the room,<br>or be there anyway',
    size: 72,
    body: 'You choose your format at checkout, and it does not change what you earn.',
    block: { type: 'duo', items: [
      { title: 'Face-to-Face', lines: ['Three days on campus in Lombard', 'Lectures, exhibit hall and hands-on sessions'] },
      { title: 'Live Streaming', lines: ['Join the lectures live from anywhere', 'Recordings to watch after the event'] },
    ] },
    caption: `Two ways to do this conference, and you pick at checkout.

FACE-TO-FACE — three days on campus in Lombard, with full access to the lectures, the exhibit hall, the hands-on sessions and everyone else who showed up.

LIVE STREAMING — join the lectures live from wherever you are, with the same CE credit eligibility, and the recordings afterward.

Nobody has to miss this one because of a plane ticket.

https://healingoasis.edu/conference-2026/attend`,
  },
  {
    id: '03-ce', date: 'Monday, August 31', theme: 'dark', image: '03-ce.jpg',
    kicker: 'Continuing education',
    headline: 'Up to 20 contact hours',
    size: 82,
    body: 'Earned the same whether you are in the room or on the live stream. Minnesota DC licences carry separate approvals for each format.',
    block: { type: 'rows', items: [
      'AAVSB-RACE — approved, ID #20-139-5976',
      'Am. Holistic Vet. Medical Assoc. — approved',
      'College of Animal Chiropractors — approved',
    ] },
    caption: `Up to 20 CE contact hours across the three days.

Approved through AAVSB-RACE (ID #20-139-5976), the American Holistic Veterinary Medical Association, and the College of Animal Chiropractors, with reciprocity through the IVCA. Minnesota chiropractic license holders: there are separate approvals for the in-person and virtual-live formats.

And yes — the live stream earns the same credit as being in the room.

https://healingoasis.edu/conference-2026/attend`,
  },
  {
    id: '04-faculty', date: 'Thursday, September 3', theme: 'light', image: '04-faculty.jpg',
    kicker: 'The faculty',
    headline: 'Sixteen reasons to come',
    size: 84,
    body: 'Board-certified veterinarians, specialists and senior educators in sports medicine, rehabilitation, neurology, surgery and dentistry.',
    block: { type: 'rows', items: [
      'Faculty from Purdue University',
      'Faculty from the University of Wisconsin–Madison',
      'Senior teaching staff from Healing Oasis',
    ] },
    caption: `Sixteen speakers this year.

Board-certified veterinarians, specialists and senior educators working in sports medicine, rehabilitation, neurology, surgery and dentistry — including faculty from Purdue University, the University of Wisconsin–Madison, and our own senior teaching staff.

The full speaker list and their synopses are on the conference page.

https://healingoasis.edu/conference-2026/attend`,
  },
  {
    id: '05-canine', date: 'Sunday, September 6', theme: 'dark', image: '05-canine.jpg',
    kicker: 'Saturday tracks',
    headline: 'Saturday, you choose.<br>Canine.',
    size: 76,
    body: 'Saturday splits into a canine track and an equine track. You choose yours when you register, at checkout.',
    block: null,
    caption: `Saturday is the day the conference splits in two.

The canine track, for the people whose whole week is dogs — rehabilitation, sports medicine, neurology, the cases that do not resolve the way the textbook says.

Saturday you go where your work is. You choose your track when you register.

https://healingoasis.edu/conference-2026/attend`,
  },
  {
    id: '06-equine', date: 'Wednesday, September 9', theme: 'light', image: '06-equine.jpg',
    kicker: 'Saturday tracks',
    headline: 'Saturday, you choose.<br>Equine.',
    size: 76,
    body: 'Saturday splits into a canine track and an equine track. You choose yours when you register, at checkout.',
    block: null,
    caption: `The other half of Saturday: the equine track.

For the people whose patients weigh half a ton. Sports medicine, rehabilitation and manual therapy for the horse, taught by clinicians who do it for a living.

Saturday you go where your work is. You choose your track when you register.

https://healingoasis.edu/conference-2026/attend`,
  },
  {
    id: '07-hotel', date: 'Friday, September 11', theme: 'dark', image: '07-hotel.jpg',
    kicker: 'Before September 16',
    headline: 'The room block closes soon',
    size: 78,
    body: 'The conference rate at the Crowne Plaza Lombard–Downers Grove is held until September 16. After that, you are booking at whatever the going rate is.',
    block: { type: 'rows', items: [
      'Crowne Plaza Lombard–Downers Grove',
      '1250 Roosevelt Rd, Lombard, IL',
      '(630) 629-6000',
    ] },
    caption: `A practical one: the hotel block closes September 16.

We hold a conference rate at the Crowne Plaza Lombard–Downers Grove, 1250 Roosevelt Rd, a few minutes from the campus. Call (630) 629-6000 and mention the Healing Oasis conference.

After the 16th the block is released and you are booking at whatever the going rate is that week. Worth doing now if you already know you are coming.

https://healingoasis.edu/conference-2026/attend`,
  },
  {
    id: '08-whofor', date: 'Monday, September 14', theme: 'light', image: '08-whofor.jpg',
    kicker: 'Who it is for',
    headline: 'Built for the people<br>doing the work',
    size: 72,
    body: 'Every group has its own registration rate. One discount may be applied per registration.',
    block: { type: 'rows', items: [
      'Veterinary technicians — $450',
      'Doctors (DC, DVM, VMD) — $580',
      'APRVT candidates — $325 · ACVSMR residents — $395',
    ] },
    caption: `Who comes to this conference?

Veterinary technicians. Doctors — DC, DVM, VMD and other licensed professionals. APRVT candidates. ACVSMR residents. Each has its own registration rate:

Veterinary technicians — $450
Doctors — $580
APRVT candidates — $325
ACVSMR residents — $395

If you put your hands on animals for a living, you will find your people here.

https://healingoasis.edu/conference-2026/attend`,
  },
  {
    id: '09-discounts', date: 'Wednesday, September 16', theme: 'dark', image: '09-discounts.jpg',
    kicker: 'Before you check out',
    headline: 'You may be paying too much',
    size: 80,
    body: 'Discount codes are applied at checkout and official documentation is required. One discount per registration, and they all expire October 13.',
    block: { type: 'stats', items: [
      { value: '15%', label: 'Healing Oasis alumni' },
      { value: '10%', label: 'association members' },
      { value: '20%', label: 'first responders &amp; military' },
    ] },
    caption: `Before you check out — make sure you are not overpaying.

15% — Healing Oasis alumni
10% — association members in good standing
20% — first responders and military, active duty and veterans, plus fire, EMS and law enforcement

Codes go in at checkout and official documentation is required. Only one discount per registration, and all of them expire October 13.

If you are not sure which one you qualify for, ask us.

https://healingoasis.edu/conference-2026/attend`,
  },
  {
    id: '10-stream', date: 'Friday, September 18', theme: 'light', image: '10-stream.jpg',
    kicker: 'Live streaming',
    headline: 'Can&#39;t get to Lombard?<br>Don&#39;t skip it.',
    size: 66,
    body: 'The live stream is not the consolation prize. Same lectures, same CE credit eligibility, and the recordings afterward.',
    block: { type: 'rows', items: [
      'Join the lectures live from anywhere',
      'The same CE credit eligibility',
      'Recordings available after the event',
    ] },
    caption: `Not everyone can take three days and a flight. That is what the live stream is for.

You join the lectures live from wherever you are. You are eligible for the same CE credit as the people in the room. And the recordings are available afterward, so a clinic emergency in the middle of a session does not cost you the session.

Choose Live Streaming at checkout.

https://healingoasis.edu/conference-2026/attend`,
  },
  {
    id: '11-handson', date: 'Monday, September 21', theme: 'light', image: '11-handson.jpg',
    kicker: 'What three days look like',
    headline: 'You will not be sitting still',
    size: 80,
    body: 'Lectures, hands-on sessions, an exhibit hall, and three days among people who do this work every day of the week.',
    block: null,
    caption: `What actually happens over three days.

Lectures from sixteen speakers. Hands-on sessions. An exhibit hall with the people who make the equipment you are already using. And the part nobody puts on the schedule — the hallway conversations with practitioners who have seen the case you cannot solve.

That last part is the reason people come back.

https://healingoasis.edu/conference-2026/attend`,
  },
  {
    id: '12-closing', date: 'Wednesday, September 23', theme: 'dark', image: '12-closing.jpg',
    kicker: 'Final deadline',
    headline: 'Registration closes<br>October 12',
    size: 74,
    body: 'That is the last day to register, in person or live stream. After that the doors are shut until next year.',
    block: { type: 'stats', items: [
      { value: 'Oct 12', label: 'registration closes' },
      { value: 'Oct 13', label: 'all discounts expire' },
      { value: 'Oct 23', label: 'the conference begins' },
    ] },
    caption: `Three dates worth writing down.

October 12 — the last day to register, whichever format you choose.
October 13 — every discount code expires.
October 23 — we open the doors in Lombard.

If you have been meaning to sort this out, now is the moment. Face-to-face or live stream, both close the same day.

https://healingoasis.edu/conference-2026/attend`,
  },
]
