import {
  PROPERTY_TYPES,
  PROPERTY_FORMATS,

} from '../constants'

export type PropertyTypes = typeof PROPERTY_TYPES[number]
export type PropertyFormats = typeof PROPERTY_FORMATS[number]

export type JsonSchema = {
  $id: string
  required?: ReadonlyArray<string>
  presets?: ReadonlyArray<string>
  properties: Record<string, Property>
}

export type Property = {
  $ref?: string
  type?: PropertyTypes
  format?: PropertyFormats
  enum?: ReadonlyArray<any>
  default?: any
  description?: string
  items?: Property

  readOnly?: boolean
  uniqueItems?: boolean

  minimum?: number
  maximum?: number
  exclusiveMinimum?: number
  exclusiveMaximum?: number

  minItems?: number
  maxItems?: number

  minLength?: number
  maxLength?: number
}
