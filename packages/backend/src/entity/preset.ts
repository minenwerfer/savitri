import merge from 'lodash/merge'

export const applyPreset = (description: any, name: string, parent?: string) => {
  const preset = require(__dirname + `/../../../data/presets/${name}`)
  return merge(description, parent ? (preset[parent]||{}) : preset)
}
