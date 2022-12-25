import * as R from 'ramda'
import { getReferencedCollection } from '../../../common'
import { getEntityAsset } from '../assets'
import type { MaybeCollectionDescription, CollectionDescription } from '../../../types'

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

export const preloadDescription = (description: MaybeCollectionDescription) => {
  if( description.alias ) {
    const _aliasedCollection = getEntityAsset(description.alias, 'description')

    const {
      $id: collectionName,
      strict,
      ...aliasedCollection

    } = _aliasedCollection

    const temp = Object.assign(aliasedCollection, description)
    Object.assign(description, temp)
  }

  const presets = description.presets || []
  if( description.owned ) {
    presets.push('owned')
  }

  if( presets.length > 0 ) {
    const merge = presets?.reduce(
      (a, presetName: string) => applyPreset(a, presetName),
      description as MaybeCollectionDescription
    )

    Object.assign(description, merge)
  }

  if( description.properties ) {
    description.properties = Object.entries(description.properties).reduce((a: any, [key, _property]) => {
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

  return description as CollectionDescription
}
