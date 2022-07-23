import merge from 'lodash/merge'
import { commonNames } from '../controller'

export const applyPreset = (description:any, collectionName:string, parentName?:string) => {
  const preset = require(__dirname + `/../../presets/${collectionName}`)
  const presetObject = Object.assign({}, parentName ? (preset[parentName]||{}) : preset)

  return merge(description, presetObject)
}

export const requireCollection = (collectionName:string): any => {
  return commonNames.includes(collectionName)
    ? require(`${__dirname}/../../../collections/${collectionName}/index.json`)
    : require(`${process.cwd()}/collections/${collectionName}/index.json`)
}

export const preloadCollection = (collection: any) => {
  if( collection.alias ) {
    const _aliasedCollection = requireCollection(collection.alias)

    const {
      collection: collectionName,
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
