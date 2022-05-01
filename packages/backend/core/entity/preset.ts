import merge from 'lodash/merge'

export const applyPreset = (description: any, name: string, parent?: string) => {
  const preset = require(__dirname + `/../../../data/presets/${name}`)
  const presetObject = Object.assign({}, parent ? (preset[parent]||{}) : preset)

  return merge(description, presetObject)
}
