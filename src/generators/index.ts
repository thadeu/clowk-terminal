import ghostty from './ghostty'
import iterm2 from './iterm2'
import terminalApp from './terminal-app'
import alacritty from './alacritty'
import kitty from './kitty'
import wezterm from './wezterm'
import windowsTerminal from './windows-terminal'
import type { Generator } from '../types'

const generators: Generator[] = [
  ghostty,
  iterm2,
  terminalApp,
  alacritty,
  kitty,
  wezterm,
  windowsTerminal,
]

export default generators
