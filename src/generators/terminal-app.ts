import { hexToRgb255 } from '../util/color'
import type { AnsiColors, Generator } from '../types'

const COLOR_MAP: [string, keyof AnsiColors][] = [
  ['ANSIBlackColor', 'black'],
  ['ANSIRedColor', 'red'],
  ['ANSIGreenColor', 'green'],
  ['ANSIYellowColor', 'yellow'],
  ['ANSIBlueColor', 'blue'],
  ['ANSIMagentaColor', 'magenta'],
  ['ANSICyanColor', 'cyan'],
  ['ANSIWhiteColor', 'white'],
  ['ANSIBrightBlackColor', 'brightBlack'],
  ['ANSIBrightRedColor', 'brightRed'],
  ['ANSIBrightGreenColor', 'brightGreen'],
  ['ANSIBrightYellowColor', 'brightYellow'],
  ['ANSIBrightBlueColor', 'brightBlue'],
  ['ANSIBrightMagentaColor', 'brightMagenta'],
  ['ANSIBrightCyanColor', 'brightCyan'],
  ['ANSIBrightWhiteColor', 'brightWhite'],
]

function component(value: number): string {
  return (value / 255).toFixed(9)
}

function archivedColor(hex: string): string {
  const { r, g, b } = hexToRgb255(hex)
  const components = `${component(r)} ${component(g)} ${component(b)}\0`
  const nsrgb = Buffer.from(components, 'latin1').toString('base64')

  const archive = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">',
    '<plist version="1.0">',
    '<dict>',
    '\t<key>$archiver</key>',
    '\t<string>NSKeyedArchiver</string>',
    '\t<key>$objects</key>',
    '\t<array>',
    '\t\t<string>$null</string>',
    '\t\t<dict>',
    '\t\t\t<key>$class</key>',
    '\t\t\t<dict>',
    '\t\t\t\t<key>CF$UID</key>',
    '\t\t\t\t<integer>2</integer>',
    '\t\t\t</dict>',
    '\t\t\t<key>NSColorSpace</key>',
    '\t\t\t<integer>2</integer>',
    '\t\t\t<key>NSRGB</key>',
    `\t\t\t<data>${nsrgb}</data>`,
    '\t\t</dict>',
    '\t\t<dict>',
    '\t\t\t<key>$classes</key>',
    '\t\t\t<array>',
    '\t\t\t\t<string>NSColor</string>',
    '\t\t\t\t<string>NSObject</string>',
    '\t\t\t</array>',
    '\t\t\t<key>$classname</key>',
    '\t\t\t<string>NSColor</string>',
    '\t\t</dict>',
    '\t</array>',
    '\t<key>$top</key>',
    '\t<dict>',
    '\t\t<key>root</key>',
    '\t\t<dict>',
    '\t\t\t<key>CF$UID</key>',
    '\t\t\t<integer>1</integer>',
    '\t\t</dict>',
    '\t</dict>',
    '\t<key>$version</key>',
    '\t<integer>100000</integer>',
    '</dict>',
    '</plist>',
  ].join('\n')

  return Buffer.from(archive, 'utf8').toString('base64')
}

function colorEntry(key: string, hex: string): string {
  return `\t<key>${key}</key>\n\t<data>${archivedColor(hex)}</data>`
}

const generator: Generator = {
  id: 'terminal-app',
  dir: 'terminal-app',
  ext: 'terminal',
  filename: (palette) => palette.name,
  render(palette) {
    const entries = COLOR_MAP.map(([key, name]) => colorEntry(key, palette.ansi[name]))

    entries.push(colorEntry('BackgroundColor', palette.background))
    entries.push(colorEntry('TextColor', palette.foreground))
    entries.push(colorEntry('TextBoldColor', palette.foreground))
    entries.push(colorEntry('CursorColor', palette.cursor))
    entries.push(colorEntry('SelectionColor', palette.selectionBackground))

    return [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">',
      '<plist version="1.0">',
      '<dict>',
      '\t<key>name</key>',
      `\t<string>${palette.name}</string>`,
      '\t<key>type</key>',
      '\t<string>Window Settings</string>',
      '\t<key>ProfileCurrentVersion</key>',
      '\t<real>2.04</real>',
      entries.join('\n'),
      '</dict>',
      '</plist>',
      '',
    ].join('\n')
  },
}

export default generator
