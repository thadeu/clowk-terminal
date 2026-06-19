import { readdirSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { loadPalette } from './util/palette'
import generators from './generators/index'
import type { Palette } from './types'

const root = join(import.meta.dir, '..')
const palettesDir = join(root, 'palettes')
const distDir = join(root, 'dist')

function loadAllPalettes(): Palette[] {
  const files = readdirSync(palettesDir).filter((file) => file.endsWith('.json'))

  if (files.length === 0) {
    throw new Error('no palettes found in palettes/ — run `bun run import` first')
  }

  return files.map((file) => loadPalette(join(palettesDir, file)))
}

function build(): void {
  const palettes = loadAllPalettes()

  rmSync(distDir, { recursive: true, force: true })

  let count = 0

  for (const generator of generators) {
    const outDir = join(distDir, generator.dir)

    mkdirSync(outDir, { recursive: true })

    for (const palette of palettes) {
      const ext = generator.ext ? `.${generator.ext}` : ''
      const file = join(outDir, `${generator.filename(palette)}${ext}`)

      writeFileSync(file, generator.render(palette))
      count += 1
    }
  }

  console.log(`clowk-terminal: built ${count} files — ${palettes.length} palette(s) × ${generators.length} formats`)
  console.log(`formats: ${generators.map((g) => g.id).join(', ')}`)
  console.log(`output:  ${distDir}`)
}

build()
