import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import type { RawPalette } from '../src/types'

const root = join(import.meta.dir, '..')

const DEFAULT_THEME = join(root, '..', 'clowk-vscode-theme', 'themes', 'clowk-night-color-theme.json')

function stripAlpha(hex?: string): string | undefined {
  if (!hex) {
    return undefined
  }

  return `#${hex.replace(/^#/, '').slice(0, 6).toLowerCase()}`
}

function main(): void {
  const themePath = process.argv[2] || DEFAULT_THEME
  const theme = JSON.parse(readFileSync(themePath, 'utf8')) as { colors: Record<string, string> }
  const c = theme.colors

  const ansiKey = (name: string): string => stripAlpha(c[`terminal.ansi${name}`]) ?? ''

  const palette: RawPalette = {
    name: 'Clowk Night',
    slug: 'clowk-night',
    author: 'clowk',
    variant: 'dark',
    source: 'clowk-vscode-theme',
    background: stripAlpha(c['terminal.background']) ?? '#0c0b14',
    foreground: stripAlpha(c['terminal.foreground']) ?? '#e0def4',
    cursor: stripAlpha(c['terminalCursor.foreground']) ?? ansiKey('Magenta') ?? '#c2a6e2',
    cursorText: stripAlpha(c['terminal.background']) ?? '#0c0b14',
    selectionBackground:
      stripAlpha(c['terminal.selectionBackground']) ?? stripAlpha(c['selection.background']) ?? '#7c3aed',
    selectionForeground: stripAlpha(c['terminal.foreground']) ?? '#e0def4',
    ansi: {
      black: ansiKey('Black'),
      red: ansiKey('Red'),
      green: ansiKey('Green'),
      yellow: ansiKey('Yellow'),
      blue: ansiKey('Blue'),
      magenta: ansiKey('Magenta'),
      cyan: ansiKey('Cyan'),
      white: ansiKey('White'),
      brightBlack: ansiKey('BrightBlack'),
      brightRed: ansiKey('BrightRed'),
      brightGreen: ansiKey('BrightGreen'),
      brightYellow: ansiKey('BrightYellow'),
      brightBlue: ansiKey('BrightBlue'),
      brightMagenta: ansiKey('BrightMagenta'),
      brightCyan: ansiKey('BrightCyan'),
      brightWhite: ansiKey('BrightWhite'),
    },
  }

  const missing = Object.entries(palette.ansi).filter(([, value]) => !value).map(([key]) => key)

  if (missing.length > 0) {
    throw new Error(`theme is missing terminal.ansi* colors: ${missing.join(', ')}`)
  }

  const outDir = join(root, 'palettes')
  const outPath = join(outDir, `${palette.slug}.json`)

  mkdirSync(outDir, { recursive: true })
  writeFileSync(outPath, `${JSON.stringify(palette, null, 2)}\n`)

  console.log(`imported "${palette.name}" from ${themePath}`)
  console.log(`wrote ${outPath}`)
}

main()
