export interface Rgb {
  r: number
  g: number
  b: number
}

export function normalizeHex(input: string): string {
  let hex = String(input).trim().replace(/^#/, '')

  if (hex.length === 3) {
    hex = hex.split('').map((c) => c + c).join('')
  }

  if (hex.length === 8) {
    hex = hex.slice(0, 6)
  }

  if (!/^[0-9a-fA-F]{6}$/.test(hex)) {
    throw new Error(`invalid hex color: ${input}`)
  }

  return hex.toLowerCase()
}

export function withHash(input: string): string {
  return `#${normalizeHex(input)}`
}

export function hexToRgb255(input: string): Rgb {
  const hex = normalizeHex(input)

  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16),
  }
}

export function hexToRgbFloat(input: string): Rgb {
  const { r, g, b } = hexToRgb255(input)

  return { r: r / 255, g: g / 255, b: b / 255 }
}
