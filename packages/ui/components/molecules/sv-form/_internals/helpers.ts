import { CollectionProperty } from '../../../../../types'
import {
  SvInput,
  SvOptions,
  SvSwitch,
  SvSelect,

} from '../../..'

import {
  SvFile
} from '../..'

import SvSearch from './components/sv-search/sv-search.vue'


export const getComponent = (property: CollectionProperty) => {
  const propType = property.type === 'array'
    ? property.items?.type
    : property.type

  switch( true ) {
    case ['checkbox', 'radio'].includes(property.s$format!):
      return SvOptions
    case  property.s$format === 'select':
      return SvSelect
    case propType === 'boolean':
      return SvSwitch
    case property.s$referencedCollection === 'file':
      return SvFile
    case property.s$isReference:
      return SvSearch

    default:
      return SvInput
  }
}

export const pushToArray = (modelValue: Array<any>) => {
  modelValue.push(null)
}

export const spliceFromArray = (modelValue: Array<any>, index: number) => {
  modelValue.splice(index, 1)
}
