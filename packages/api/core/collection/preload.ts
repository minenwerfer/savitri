import * as R from 'ramda'
import { getReferencedCollection } from '../../../common'
import { getEntityAsset } from '../assets'
import type { MaybeCollectionDescription } from '../../../types'

export const applyPreset = (description: MaybeCollectionDescription, collectionName:string, parentName?:string) => {
  const preset = require(`${__dirname}/../../presets/${collectionName}`)
  const presetObject = Object.assign({}, parentName ? (preset[parentName]||{}) : preset)

  return R.mergeDeepWith(
    (l, r) => R.is(Object, l) && R.is(Object, r)
      ? R.concat(l, r)
      : l,
    description,
    presetObject
  )
}

export const preloadCollection = (collection: MaybeCollectionDescription) => {
  if( collection.alias ) {
    const _aliasedCollection = getEntityAsset(collection.alias, 'description')

    const {
      $id: collectionName,
      strict,
      ...aliasedCollection

    } = _aliasedCollection

    const temp = Object.assign(aliasedCollection, collection)
    Object.assign(collection, temp)
  }

  const presets = collection.presets || []
  if( collection.owned ) {
    presets.push('owned')
  }

  if( presets.length > 0 ) {
    const merge = presets?.reduce(
      (a, presetName: string) => applyPreset(a, presetName),
      collection as MaybeCollectionDescription
    )

    Object.assign(collection, merge)
  }

  if( collection.properties ) {
    collection.properties = Object.entries(collection.properties).reduce((a: any, [key, _property]) => {
      const property = Object.assign({}, _property)
      const reference = getReferencedCollection(property)

      if( reference ) {
        property.s$isReference = true
        property.s$isFile = reference.$ref === 'file'
        property.s$referencedCollection = reference.$ref
      }

      return {
        ...a,
        [key]: property
      }
    }, {})
  }

  return collection
}
