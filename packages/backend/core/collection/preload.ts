import merge from 'lodash/merge'
import { commonControllers } from '../controller'

export const applyPreset = (description: any, name: string, parent?: string) => {
  const preset = require(__dirname + `/../../presets/${name}`)
  const presetObject = Object.assign({}, parent ? (preset[parent]||{}) : preset)

  return merge(description, presetObject)
}

export const requireCollection = (collectionName:string): any => {
  return commonControllers.includes(collectionName)
    ? require(`${__dirname}/../../collections/${collectionName}/index.json`)
    : require(`${process.cwd()}/collections/${collectionName}/index.json`)
}

export const preloadCollection = (collection: any) => {
  if( collection.alias ) {
    const _aliasedCollection = requireCollection(collection.alias)

    const {
      module,
      route,
      strict,
      ...aliasedCollection

    } = _aliasedCollection

    const temp = Object.assign(aliasedCollection, collection)
    Object.assign(collection, temp)
  }

  collection.presets?.forEach((presetName: string) => {
    applyPreset(collection, presetName)
  })
  
  return collection
}
