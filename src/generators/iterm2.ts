import { hexToRgbFloat } from '../util/color'
import type { Generator } from '../types'

function real(value: number): string {
  if (value === 0) {
    return '0.0'
  }

  if (value === 1) {
    return '1.0'
  }

  return String(value)
}

function colorDict(hex: string): string {
  const { r, g, b } = hexToRgbFloat(hex)

  return [
    '\t<dict>',
    '\t\t<key>Color Space</key>',
    '\t\t<string>sRGB</string>',
    '\t\t<key>Alpha Component</key>',
    '\t\t<real>1</real>',
    '\t\t<key>Red Component</key>',
    `\t\t<real>${real(r)}</real>`,
    '\t\t<key>Green Component</key>',
    `\t\t<real>${real(g)}</real>`,
    '\t\t<key>Blue Component</key>',
    `\t\t<real>${real(b)}</real>`,
    '\t</dict>',
  ].join('\n')
}

const generator: Generator = {
  id: 'iterm2',
  dir: 'iterm2',
  ext: 'itermcolors',
  filename: (palette) => palette.name,
  render(palette) {
    const entries: [string, string][] = []

    palette.ansi16.forEach((color, index) => {
      entries.push([`Ansi ${index} Color`, color])
    })

    entries.push(['Background Color', palette.background])
    entries.push(['Foreground Color', palette.foreground])
    entries.push(['Bold Color', palette.foreground])
    entries.push(['Cursor Color', palette.cursor])
    entries.push(['Cursor Text Color', palette.cursorText])
    entries.push(['Selection Color', palette.selectionBackground])
    entries.push(['Selected Text Color', palette.selectionForeground])
    entries.push(['Link Color', palette.ansi.blue])
    entries.push(['Cursor Guide Color', palette.selectionBackground])

    const body = entries
      .map(([key, hex]) => `\t<key>${key}</key>\n${colorDict(hex)}`)
      .join('\n')

    return [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">',
      '<plist version="1.0">',
      '<dict>',
      body,
      '</dict>',
      '</plist>',
      '',
    ].join('\n')
  },
}

export default generator
