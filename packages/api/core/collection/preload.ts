import * as R from 'ramda'
import type { CollectionDescription } from '../../../common/types'
import { commonNames } from '../controller'

export const applyPreset = (description: CollectionDescription, collectionName:string, parentName?:string) => {
  const preset = require(__dirname + `/../../presets/${collectionName}`)
  const presetObject = Object.assign({}, parentName ? (preset[parentName]||{}) : preset)

  return R.mergeDeepWith(
    (l, r) => R.is(Object, l) && R.is(Object, r)
      ? R.concat(l, r)
      : l,
    description,
    presetObject
  )
}

export const requireCollection = (collectionName:string): any => {
  return commonNames.includes(collectionName)
    ? require(`${__dirname}/../../../collections/${collectionName}/index.json`)
    : require(`${process.cwd()}/collections/${collectionName}/index.json`)
}

export const preloadCollection = (collection: Omit<CollectionDescription, 'fields'>) => {
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

  if( collection.presets ) {
    return collection.presets?.reduce((a: CollectionDescription, presetName: string) => {
      return applyPreset(a, presetName)

    }, collection as CollectionDescription)
  }
  
  return collection
}
