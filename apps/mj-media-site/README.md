# MJ Media, LLC — new website

A modern one-page site for MJ Media, LLC (South Milwaukee, WI), rebuilt from the
content on their current site at mjmedia.rocks.

## How to look at it

Open `index.html` in a browser. That's it — no install, no build step.

If images or fonts look odd when opened directly, serve the folder instead:

```
cd apps/mj-media-site
python3 -m http.server 8899
```

then visit http://localhost:8899

## What's here

```
index.html    the whole page
styles.css    all the styling
script.js     mobile menu, fade-ins, and the quote form
images/       banners and the map towel, pulled from mjmedia.rocks
```

## Notes

- Plain HTML/CSS/JS on purpose. Nothing to install, and any host can serve it.
- The quote form opens a pre-written message in the visitor's own email app
  (`art@mediamj.com`). No server, so nothing can silently fail to send. Turning it
  into a form that lands directly in their inbox needs hosting + an email service —
  that's a Dan job.
- All copy, prices and contact details come from the live mjmedia.rocks pages
  (home, websites, printed material, logo design, banners, map, contact) as of
  2026-08-16. Prices should be confirmed with MJ Media before this goes anywhere public.
- Sample images are MJ Media's own client work, resized for the web.
