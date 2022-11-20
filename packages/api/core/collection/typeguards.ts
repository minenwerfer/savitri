import type {
  MaybeCollectionDescription,
  MaybeCollectionAction,
  CollectionProperty,
  PropertyTypes,
  CollectionPresets,
  StoreEffect

} from '../../../types'

import {
  PROPERTY_TYPES,
  COLLECTION_PRESETS,
  STORE_EFFECTS

} from '../../../types/constants'

export const presets = (description: MaybeCollectionDescription): MaybeCollectionDescription => {
  const isValidPresets = (preset?: string): preset is CollectionPresets => {
    return COLLECTION_PRESETS.includes(preset as CollectionPresets)
  }

  description.presets?.forEach((preset: string) => {
    if( !isValidPresets(preset) ) {
      throw TypeError(
        `invalid preset "${preset}" at "${(description as MaybeCollectionDescription).$id}"`
      )
    }
  })

  return description
}
export const properties = (description: MaybeCollectionDescription): MaybeCollectionDescription => {
  const isValidPropertyType = (propertyType?: string): propertyType is PropertyTypes => {
    return PROPERTY_TYPES.includes(propertyType as PropertyTypes)
  }

  Object.entries(description?.properties||{}).forEach(([propertyName, _property]) => {
    const property = _property as Pick<CollectionProperty, 'type' | '$ref' | 'enum'>
    if( property.type && !isValidPropertyType(property.type) ) {
      throw TypeError(
        `invalid property type "${property.type}" at "${(description as MaybeCollectionDescription).$id}.${propertyName}"`
      )
    }
  })

  return description
}

export const actions = (description: MaybeCollectionDescription): MaybeCollectionDescription => {
  const isValidStoreEffect = (effectName?: string): effectName is StoreEffect => {
    return Object.keys(STORE_EFFECTS).includes(effectName as StoreEffect)
  }

  const checkActions = ([actionName, action]: [string, MaybeCollectionAction|null]) => {
    if( action === null ) {
      return
    }

    if( action.effect && !isValidStoreEffect(action.effect) ) {
      throw TypeError(
        `invalid action effect "${action.effect}" at "${actionName}@${(description as MaybeCollectionDescription).$id}"`
      )
    }
  }

  Object.entries(description?.actions||{}).forEach(checkActions)
  Object.entries(description?.individualActions||{}).forEach(checkActions)

  return description
}
