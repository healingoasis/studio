import { writeFileSync, mkdirSync, readdirSync } from 'node:fs'
import { page } from './shell.mjs'

const dir = new URL('./designs/', import.meta.url)
const files = readdirSync(dir).filter(f => /^a\d\d\.mjs$/.test(f)).sort()
mkdirSync(new URL('./out/', import.meta.url), { recursive: true })

for (const f of files) {
  const { meta, default: body } = await import(new URL(f, dir))
  writeFileSync(new URL(`./out/${meta.id}.html`, import.meta.url), page(body, meta.bg))
  console.log(`${meta.id.padEnd(22)} ${meta.date.padEnd(24)} ${meta.angle}`)
}
