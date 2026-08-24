import { writeFileSync, mkdirSync } from 'node:fs'
import { shell } from './kit.mjs'
import { render } from './slides.mjs'
import { CAROUSELS } from './carousels.mjs'

mkdirSync(new URL('./out/', import.meta.url), { recursive: true })

// Feeds are visual. Any slide that can carry a photograph gets one, drawn from
// the carousel's own set — quad and person slides already are photographs.
const NO_PHOTO = new Set(['quad', 'person'])

let n = 0, withPhoto = 0
for (const c of CAROUSELS) {
  let k = 0
  c.slides.forEach((sl, i) => {
    if (!sl.img && !NO_PHOTO.has(sl.kind) && c.photos?.length) {
      sl.img = c.photos[k % c.photos.length]
      k++
    }
    if (sl.img || NO_PHOTO.has(sl.kind)) withPhoto++
    const name = `${c.id}_s${String(i + 1).padStart(2, '0')}`
    writeFileSync(new URL(`./out/${name}.html`, import.meta.url),
      shell(render(sl, c.th, i, c.slides.length), c.th.bg))
    n++
  })
  console.log(`${c.id.padEnd(24)} ${String(c.slides.length).padStart(2)} slides   ${c.date}`)
}
console.log(`\n${CAROUSELS.length} carousels · ${n} slides · ${withPhoto} carry photography`)
