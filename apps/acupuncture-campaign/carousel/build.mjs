import { writeFileSync, mkdirSync } from 'node:fs'
import { shell } from './kit.mjs'
import { render } from './slides.mjs'
import { CAROUSELS, POOL } from './carousels.mjs'

mkdirSync(new URL('./out/', import.meta.url), { recursive: true })

// Every photograph appears EXACTLY ONCE across the campaign. Slides that do not
// draw one stay typographic — a run of six photo slides is as monotonous as a
// run of six type slides, so the alternation is deliberate.
const NEVER = new Set(['quad', 'person'])

// Anything hard-coded on a slide is spoken for before the pool opens.
const spoken = new Set()
for (const c of CAROUSELS) for (const sl of c.slides) if (sl.img) spoken.add(sl.img)
const pool = POOL.filter((p) => !spoken.has(p))

let placed = 0, typeOnly = 0
for (const c of CAROUSELS) {
  c.slides.forEach((sl, i) => {
    const wants = !NEVER.has(sl.kind) && (sl.kind === 'photo' || i % 2 === 0)
    if (wants && !sl.img && pool.length) sl.img = pool.shift()
    if (sl.img || NEVER.has(sl.kind)) placed++; else typeOnly++
    const name = `${c.id}_s${String(i + 1).padStart(2, '0')}`
    writeFileSync(new URL(`./out/${name}.html`, import.meta.url),
      shell(render(sl, c.th, i, c.slides.length), c.th.bg))
  })
  console.log(`${c.id.padEnd(24)} ${String(c.slides.length).padStart(2)} slides   ${c.date}`)
}
console.log(`\n${CAROUSELS.length} carousels · ${placed + typeOnly} slides`)
console.log(`${placed} carry an image · ${typeOnly} typographic · ${pool.length} photos still unused`)
