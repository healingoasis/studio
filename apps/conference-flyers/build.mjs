// Builds both outputs from ONE copy of each flyer's markup, so the previews
// and the canvas artboards can never drift apart.
import { readFileSync, writeFileSync } from 'node:fs'

const FONTS = 'https://fonts.googleapis.com/css2?family=Bitter:wght@400;700&family=Manrope:wght@400;500;600;700;800&display=swap'

const STYLE = `
    body { margin: 0; background: #ffffff; font-family: 'Manrope', 'Helvetica Neue', Arial, sans-serif; }
    a { color: #5c0101; text-decoration: none; }
    a:hover { color: #7a3a3a; }
    h1, p { text-wrap: pretty; }
`

const OPTIONS = [
  { id: 'A', file: 'Main.dc.html', preview: 'preview-a.html' },
  { id: 'B', file: 'Poster.dc.html', preview: 'preview-b.html' },
  { id: 'C', file: 'TwoWays.dc.html', preview: 'preview-c.html' },
]

for (const opt of OPTIONS) {
  const body = readFileSync(new URL(`./parts/${opt.id}.body.html`, import.meta.url), 'utf8').trim()

  writeFileSync(new URL(`./${opt.preview}`, import.meta.url), `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
<style>${STYLE}</style>
</head>
<body>
${body}
</body>
</html>
`)

  writeFileSync(new URL(`./${opt.file}`, import.meta.url), `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="${FONTS}">
  <style>${STYLE}</style>
</helmet>
${body}
</x-dc>
<script data-dc-script data-props='{}'>
class Component extends DCLogic {
  renderVals() {
    return {};
  }
}
</script>
</body>
</html>
`)

  console.log(`${opt.id} -> ${opt.file}, ${opt.preview}`)
}
