import type {
  MaybeCollectionDescription,
  CollectionField,
  CollectionFieldType,
  CollectionPreset

} from '../../../common/types'

import { COLLECTION_FIELD_TYPES, COLLECTION_PRESETS } from '../../../common/constants'

const isValidPreset = (preset?: string): preset is CollectionPreset => {
  return COLLECTION_PRESETS.includes(preset as CollectionPreset)
}

const isValidFieldType = (fieldType?: string): fieldType is CollectionFieldType => {
  return COLLECTION_FIELD_TYPES.includes(fieldType as CollectionFieldType)
}

export const presets = (description: MaybeCollectionDescription): MaybeCollectionDescription => {
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
  Object.values(description?.fields||{}).forEach((_field: unknown) => {
    const field = _field as Pick<CollectionField, 'type' | 'collection'>
    if( !isValidFieldType(field.type) && !field.collection ) {
      throw TypeError(
        `invalid field type "${field.type} at "${(description as MaybeCollectionDescription).collection}"`
      )
    }
  })

  return description
}
