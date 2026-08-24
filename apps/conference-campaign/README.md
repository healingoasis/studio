# 2026 Conference — 30-day Facebook campaign

Twelve posts, 25 August to 23 September 2026, every two to three days. Each post
is a 1080x1350 image plus caption text. All twelve sell both ways to attend.

    posts.mjs    the campaign as data: copy, images, theme, caption per post
    build.mjs    one template -> out/*.html
    img/         cropped hero photos + logo
    png/, jpg/   rendered posts (jpg is what gets posted)
    schedule.txt generated posting schedule with every caption

Rebuild:  node build.mjs  then re-render with headless Chrome at 1080x1350.

## Sources

Photos come from Daniel's media folder: the Conference, CE and Acupuncture sets.
The equine shots are from the CE seminars, the canine treatment shots from the
Acupuncture set; the rest are from the conference itself.

## Facts

Every claim was checked against healingoasis.edu/conference-2026/attend on
2026-08-24 — 27 automated checks covering dates, venue, CE hours and accrediting
bodies, the RACE ID, hotel block, all four registration rates, all three
discounts, and both deadlines. No flyer carries stale early-bird pricing or the
disputed venue ZIP.

One claim was cut rather than shipped unverified: that Friday and Sunday are
joint sessions. The site only states that Saturday carries the track split, and
the schedule PDF would not extract cleanly enough to confirm the rest.

## Delivery

Google Drive: Marketing / Conference / 2026 / Conference Campaign 30 Day —
holds the posting schedule. The images could not be uploaded from here: the
Drive connector only accepts inline base64, which is far too large for images,
and Drive's web uploader needs an OS file dialog. The images are staged on
Daniel's Desktop in a folder of the same name for him to drag across.
