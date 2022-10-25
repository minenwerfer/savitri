import type {
  MaybeCollectionDescription,
  MaybeCollectionAction,
  CollectionField,
  CollectionFieldType,
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
        `invalid preset "${preset}" at "${(description as MaybeCollectionDescription).collection}"`
      )
    }
  })

  return description
}
export const fields = (description: MaybeCollectionDescription): MaybeCollectionDescription => {
  const isValidFieldType = (fieldType?: string): fieldType is CollectionFieldType => {
    return COLLECTION_FIELD_TYPES.includes(fieldType as CollectionFieldType)
  }

  Object.values(description?.fields||{}).forEach((_field: unknown) => {
    const field = _field as Pick<CollectionField, 'type' | 'collection'>
    if( !isValidFieldType(field.type) && !field.collection ) {
      throw TypeError(
        `invalid field type "${field.type}" at "${(description as MaybeCollectionDescription).collection}"`
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
        `invalid action effect "${action.effect}" at "${actionName}@${(description as MaybeCollectionDescription).collection}"`
      )
    }
  }

  Object.entries(description?.actions||{}).forEach(checkActions)
  Object.entries(description?.individualActions||{}).forEach(checkActions)

  return description
}
