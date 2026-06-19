import { readFileSync } from 'node:fs'
import type { AnsiColors, Palette, RawPalette } from '../types'

export const ANSI_ORDER: (keyof AnsiColors)[] = [
  'black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white',
  'brightBlack', 'brightRed', 'brightGreen', 'brightYellow',
  'brightBlue', 'brightMagenta', 'brightCyan', 'brightWhite',
]

export function normalizePalette(raw: RawPalette): Palette {
  const ansi16 = ANSI_ORDER.map((name) => {
    const value = raw.ansi?.[name]

    if (!value) {
      throw new Error(`palette "${raw.slug}" is missing ansi color: ${name}`)
    }

    return value
  })

  return { ...raw, ansi16 }
}

export function loadPalette(path: string): Palette {
  const raw = JSON.parse(readFileSync(path, 'utf8')) as RawPalette

  return normalizePalette(raw)
}
