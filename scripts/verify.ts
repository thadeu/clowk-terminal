import { readdirSync, existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { loadPalette } from '../src/util/palette'

const root = join(import.meta.dir, '..')
const dist = join(root, 'dist')

function hasPlutil(): boolean {
  return Bun.which('plutil') !== null
}

function lint(path: string): void {
  const result = Bun.spawnSync(['plutil', '-lint', path])

  if (result.exitCode !== 0) {
    throw new Error(`plutil -lint failed for ${path}: ${result.stderr.toString()}`)
  }
}

function lintDir(dir: string): number {
  if (!existsSync(dir)) {
    return 0
  }

  const files = readdirSync(dir)

  for (const file of files) {
    lint(join(dir, file))
  }

  return files.length
}

function floatToByteHex(value: string): string {
  const byte = Math.round(parseFloat(value) * 255)

  return byte.toString(16).padStart(2, '0')
}

function decodeTerminalColor(name: string, key: string): string {
  const file = join(dist, 'terminal-app', `${name}.terminal`)
  const xml = readFileSync(file, 'utf8')
  const outer = xml.match(new RegExp(`<key>${key}</key>\\s*<data>([\\s\\S]*?)</data>`))
  const innerXml = Buffer.from(outer![1].replace(/\s+/g, ''), 'base64').toString('utf8')
  const nsrgb = innerXml.match(/<key>NSRGB<\/key>\s*<data>([\s\S]*?)<\/data>/)
  const ascii = Buffer.from(nsrgb![1].replace(/\s+/g, ''), 'base64').toString('latin1')
  const [r, g, b] = ascii.replace(/\0/g, '').trim().split(/\s+/)

  return `#${floatToByteHex(r)}${floatToByteHex(g)}${floatToByteHex(b)}`
}

function main(): void {
  if (!hasPlutil()) {
    console.log('verify: plutil not found (non-macOS) — skipping plist checks')

    return
  }

  const iterm = lintDir(join(dist, 'iterm2'))
  const terminal = lintDir(join(dist, 'terminal-app'))

  console.log(`verify: linted ${iterm} .itermcolors + ${terminal} .terminal — all well-formed`)

  const palette = loadPalette(join(root, 'palettes', 'clowk-night.json'))

  const checks: [string, string][] = [
    ['BackgroundColor', palette.background],
    ['ANSIRedColor', palette.ansi.red],
    ['CursorColor', palette.cursor],
  ]

  let failed = 0

  for (const [key, expected] of checks) {
    const decoded = decodeTerminalColor(palette.name, key)
    const ok = decoded === expected.toLowerCase()

    console.log(`verify: ${key} → ${decoded} (expected ${expected}) ${ok ? 'OK' : 'MISMATCH'}`)

    if (!ok) {
      failed += 1
    }
  }

  if (failed > 0) {
    console.error(`verify: ${failed} color(s) did not round-trip`)
    process.exit(1)
  }

  console.log('verify: Terminal.app archive round-trips correctly')
}

main()
