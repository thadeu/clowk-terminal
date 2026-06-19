import { withHash } from '../util/color'
import type { Generator } from '../types'

const generator: Generator = {
  id: 'windows-terminal',
  dir: 'windows-terminal',
  ext: 'json',
  filename: (palette) => palette.slug,
  render(palette) {
    const a = palette.ansi

    const scheme = {
      name: palette.name,
      background: withHash(palette.background),
      foreground: withHash(palette.foreground),
      cursorColor: withHash(palette.cursor),
      selectionBackground: withHash(palette.selectionBackground),
      black: withHash(a.black),
      red: withHash(a.red),
      green: withHash(a.green),
      yellow: withHash(a.yellow),
      blue: withHash(a.blue),
      purple: withHash(a.magenta),
      cyan: withHash(a.cyan),
      white: withHash(a.white),
      brightBlack: withHash(a.brightBlack),
      brightRed: withHash(a.brightRed),
      brightGreen: withHash(a.brightGreen),
      brightYellow: withHash(a.brightYellow),
      brightBlue: withHash(a.brightBlue),
      brightPurple: withHash(a.brightMagenta),
      brightCyan: withHash(a.brightCyan),
      brightWhite: withHash(a.brightWhite),
    }

    return `${JSON.stringify(scheme, null, 2)}\n`
  },
}

export default generator
