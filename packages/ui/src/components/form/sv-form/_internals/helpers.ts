import { CollectionProperty } from '@semantic-api/types'
import { deepClone } from '@semantic-api/common'
import { useStore } from '@savitri/web'

import SvInput from '../../sv-input/sv-input.vue'
import SvOptions from '../../sv-options/sv-options.vue'
import SvSwitch from '../../sv-switch/sv-switch.vue'
import SvSelect from '../../sv-select/sv-select.vue'
import SvFile from '../../sv-file/sv-file.vue'
import SvSearch from '../../sv-search/sv-search.vue'
import SvForm from '../../sv-form/sv-form.vue'

export const getComponent = (property: CollectionProperty, customComponents: Record<string, any>) => {
  const nestedProp = property.type === 'array'
    ? property.items
    : property

  // strangely enough this won't work if placed outside function
  const defaultComponents = {
    options: SvOptions,
    select: SvSelect,
    switch: SvSwitch,
    file: SvFile,
    search: SvSearch,
    input: SvInput,
    form: SvForm
  }

  const mappedComponentType = (() => {
    if( !nestedProp ) {
      return 'input'
    }

    switch( true ) {
      case ['checkbox', 'radio'].includes(property.s$element!):
        return 'options'
      case property.s$element === 'select':
        return 'select'
      case nestedProp.type === 'boolean':
        return 'switch'
      case property.s$referencedCollection === 'file':
        return 'file'
      case property.s$isReference:
        return 'search'
      case !!nestedProp.enum:
        return 'select'
      case nestedProp.type === 'object':
        return 'form'

      default:
        return 'input'
    }
  })()

  if( customComponents?.[mappedComponentType] ) {
    return customComponents[mappedComponentType]
  }

  return defaultComponents[mappedComponentType] || defaultComponents.input
}

export const pushToArray = (modelValue: Array<any>, property: CollectionProperty) => {
  modelValue ??= []
  const propType = property.items?.type || property.type
  if( property.s$isReference ) {
    const helperStore = useStore(property.s$referencedCollection!)
    const newVal = deepClone(helperStore.$freshItem)
    return modelValue.push(newVal)
  }

  if( propType === 'object' ) {
    return modelValue.push({})
  }

  return modelValue.push(null)
}

export const spliceFromArray = (modelValue: Array<any>, index: number) => {
  modelValue.splice(index, 1)
}
