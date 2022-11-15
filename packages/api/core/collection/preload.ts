import * as R from 'ramda'
import { getReferencedCollection, CollectionDescription } from '../../../common'
import type { DeepWritable } from '../../../common/types'

export const applyPreset = (description: CollectionDescription, collectionName:string, parentName?:string) => {
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

export const requireCollection = (collectionName:string): any => {
  return require(`${process.cwd()}/collections/${collectionName}/${collectionName}.description.json`)
}

export const preloadCollection = (
  collection: Omit<CollectionDescription, 'properties'> & {
    properties?: DeepWritable<CollectionDescription['properties']>
  }
) => {
  if( collection.alias ) {
    const _aliasedCollection = requireCollection(collection.alias)

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
      collection as CollectionDescription
    )

    Object.assign(collection, merge)
  }

  if( collection.properties ) {
    collection.properties = Object.entries(collection.properties).reduce((a: any, [key, _property]) => {
      const property = Object.assign({}, _property)
      const reference = getReferencedCollection(property)

      if( reference ) {
        property.type ??= 'reference'
        property.isReference = true
        property.dynamicReference = !property.$ref
      }

      return {
        ...a,
        [key]: property
      }
    }, {})
  }

  collection.name = collection.$id.split('/').pop() as string
  return collection
}
