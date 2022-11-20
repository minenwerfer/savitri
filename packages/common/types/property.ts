import {
  PROPERTY_TYPES,
  PROPERTY_FORMATS,
  PROPERTY_UI_FORMATS,

} from '../constants'

export type PropertyTypes = typeof PROPERTY_TYPES[number]
export type PropertyFormats = typeof PROPERTY_FORMATS[number]
export type PropertyUiFormats = typeof PROPERTY_UI_FORMATS[number]

export type Property = {
  $ref?: string
  type?: PropertyTypes
  format?: PropertyFormats
  enum?: Array<any>
  default?: any
  description?: string
  items?: Property
  readOnly?: boolean

  minimum?: number
  maximum?: number
  exclusiveMinimum?: number
  exclusiveMaximum?: number
}
