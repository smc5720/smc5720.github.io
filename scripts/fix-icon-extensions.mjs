import { renameSync, existsSync } from 'fs'
import { resolve } from 'path'

const outDir = resolve('out')
const renames = [
  ['apple-icon', 'apple-icon.png'],
  ['icon', 'icon.png'],
]

for (const [from, to] of renames) {
  const src = resolve(outDir, from)
  const dest = resolve(outDir, to)
  if (existsSync(src) && !existsSync(dest)) {
    renameSync(src, dest)
    console.log(`renamed: ${from} → ${to}`)
  }
}
