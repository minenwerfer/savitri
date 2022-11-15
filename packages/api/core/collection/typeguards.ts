import type {
  MaybeCollectionDescription,
  MaybeCollectionAction,
  CollectionProperty,
  CollectionPropertyType,
  CollectionPreset,
  StoreEffect

} from '../../../common/types'

import {
  COLLECTION_FIELD_TYPES,
  COLLECTION_PRESETS,
  STORE_EFFECTS

} from '../../../common/constants'

export const presets = (description: MaybeCollectionDescription): MaybeCollectionDescription => {
  const isValidPreset = (preset?: string): preset is CollectionPreset => {
    return COLLECTION_PRESETS.includes(preset as CollectionPreset)
  }

  description.presets?.forEach((preset: string) => {
    if( !isValidPreset(preset) ) {
      throw TypeError(
        `invalid preset "${preset}" at "${(description as MaybeCollectionDescription).$id}"`
      )
    }
  })

  return description
}
export const properties = (description: MaybeCollectionDescription): MaybeCollectionDescription => {
  const isValidPropertyType = (propertyType?: string): propertyType is CollectionPropertyType => {
    return COLLECTION_FIELD_TYPES.includes(propertyType as CollectionPropertyType)
  }

  Object.values(description?.properties||{}).forEach((_property: unknown) => {
    const property = _property as Pick<CollectionProperty, 'type' | '$ref'>
    if( !isValidPropertyType(property.type) && !property.$ref ) {
      throw TypeError(
        `invalid property type "${property.type}" at "${(description as MaybeCollectionDescription).$id}"`
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
