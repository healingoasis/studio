// The only thing the twelve posts share: the brand's ink, its two typefaces,
// and the canvas size. Every layout below is drawn from scratch.
export const FONTS = 'https://fonts.googleapis.com/css2?family=Bitter:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Manrope:wght@400;500;600;700;800&display=swap'

export const C = {
  maroon: '#5c0101',
  deep:   '#2b0606',
  ink:    '#2a1512',
  cream:  '#f5ecdf',
  paper:  '#faf6ef',
  ember:  '#c9502a',
  muted:  '#6b5550',
}

export const page = (id, body, bg) => `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
<style>
  html, body { margin: 0; padding: 0; background: ${bg}; }
  * { box-sizing: border-box; }
  .stage { width: 1080px; height: 1350px; position: relative; overflow: hidden;
           font-family: 'Manrope', 'Helvetica Neue', Arial, sans-serif;
           background: ${bg}; }
  h1, h2, p { margin: 0; }
</style>
</head>
<body>
<div class="stage">
${body}
</div>
</body>
</html>
`
