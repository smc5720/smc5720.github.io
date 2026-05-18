/**
 * gen-favicon.mjs
 * Generates src/app/favicon.ico from the SVG icon using sharp + png-to-ico.
 * Run: node scripts/gen-favicon.mjs
 */
import sharp from 'sharp'
import pngToIco from 'png-to-ico'
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const svgPath = join(root, 'src', 'app', 'icon.svg')
const outPath = join(root, 'src', 'app', 'favicon.ico')

const svgBuffer = readFileSync(svgPath)

// Generate 16px and 32px PNG buffers from the SVG
const [png16, png32] = await Promise.all([
  sharp(svgBuffer).resize(16, 16).png().toBuffer(),
  sharp(svgBuffer).resize(32, 32).png().toBuffer(),
])

// Combine into a single .ico with both sizes
const icoBuffer = await pngToIco([png16, png32])
writeFileSync(outPath, icoBuffer)

console.log(`favicon.ico written to ${outPath} (16x16 + 32x32)`)
