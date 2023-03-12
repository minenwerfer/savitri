import type { InstanceConfig } from './types'

const DEFAULT_THEMES = [
  'default',
  'dark',
  'contrast'
]

export default (config: InstanceConfig) => {
  const lines = [];
  const themes = config.themes || DEFAULT_THEMES

  lines.push("@import '@savitri/ui/scss/theming'")
  lines.push(`$themes: ${themes.join(',')}`)
  return lines.join('\n;') + ';'
}
