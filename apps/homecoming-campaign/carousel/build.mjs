import { writeFileSync, mkdirSync } from 'node:fs'
import { shell } from './kit.mjs'
import { render } from './slides.mjs'
import { CAROUSELS } from './carousels.mjs'
mkdirSync(new URL('./out/', import.meta.url), { recursive: true })
let n = 0
for (const c of CAROUSELS) {
  c.slides.forEach((sl, i) => {
    const name = `${c.id}_s${String(i + 1).padStart(2, '0')}`
    writeFileSync(new URL(`./out/${name}.html`, import.meta.url), shell(render(sl, c.th, i, c.slides.length), c.th.bg))
    n++
  })
  console.log(`${c.id.padEnd(20)} ${String(c.slides.length).padStart(2)} slides   ${c.date}`)
}
console.log(`\n${CAROUSELS.length} carousels · ${n} slides`)
