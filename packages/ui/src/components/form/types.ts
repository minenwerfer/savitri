import type { CollectionProperty } from '@semantic-api/types'

export type FormFieldProps<TType> = {
  modelValue: TType
  property?: CollectionProperty
  propertyName?: string
  parentCollection?: string
}
