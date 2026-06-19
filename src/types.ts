export interface AnsiColors {
  black: string
  red: string
  green: string
  yellow: string
  blue: string
  magenta: string
  cyan: string
  white: string
  brightBlack: string
  brightRed: string
  brightGreen: string
  brightYellow: string
  brightBlue: string
  brightMagenta: string
  brightCyan: string
  brightWhite: string
}

export interface RawPalette {
  name: string
  slug: string
  author?: string
  variant?: string
  source?: string
  background: string
  foreground: string
  cursor: string
  cursorText: string
  selectionBackground: string
  selectionForeground: string
  ansi: AnsiColors
}

export interface Palette extends RawPalette {
  ansi16: string[]
}

export interface Generator {
  id: string
  dir: string
  ext: string
  filename: (palette: Palette) => string
  render: (palette: Palette) => string
}
