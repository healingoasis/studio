import { writeFileSync, mkdirSync, readdirSync } from 'node:fs'
import { page } from './shell.mjs'

const dir = new URL('./designs/', import.meta.url)
const files = readdirSync(dir).filter(f => /^d\d\d\.mjs$/.test(f)).sort()

mkdirSync(new URL('./out/', import.meta.url), { recursive: true })

export const ALL = []
for (const f of files) {
  const mod = await import(new URL(f, dir))
  const { meta, default: body } = mod
  writeFileSync(new URL(`./out/${meta.id}.html`, import.meta.url), page(meta.id, body, meta.bg))
  ALL.push(meta)
  console.log(`${meta.id.padEnd(22)} ${meta.date.padEnd(24)} ${meta.angle}`)
}
