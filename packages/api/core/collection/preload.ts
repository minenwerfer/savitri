import * as R from 'ramda'
import { getReferencedCollection, CollectionDescription } from '../../../common'

type DeepWritable<T> = {
  -readonly [P in keyof T]: DeepWritable<T[P]>
}

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
  return require(`${process.cwd()}/collections/${collectionName}/${collectionName}.schema.json`)
}

export const preloadCollection = (
  collection: Omit<CollectionDescription, 'fields'> & {
    fields?: DeepWritable<CollectionDescription['fields']>
  }
) => {
  if( collection.alias ) {
    const _aliasedCollection = requireCollection(collection.alias)

    const {
      collection: collectionName,
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
    return collection.presets?.reduce((a: CollectionDescription, presetName: string) => {
      return applyPreset(a, presetName)

    }, collection as CollectionDescription)
  }

  if( collection.fields ) {
    collection.fields = Object.entries(collection.fields).reduce((a: any, [key, _field]) => {
      const field = Object.assign({}, _field)
      const reference = getReferencedCollection(field)

      if( reference ) {
        field.type ??= 'reference'
        field.isReference = true
        field.dynamicReference = !field.collection
        field.referencedCollection = reference.collection
      }

      return {
        ...a,
        [key]: field
      }
    }, {})
  }

  return collection
}
