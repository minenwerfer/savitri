import { CollectionProperty } from '../../../../../types'
import { deepClone } from '../../../../../common'
import { useStore } from '../../../../../web'
import {
  SvInput,
  SvOptions,
  SvSwitch,
  SvSelect,
  SvFile,
  SvSearch

} from '../..'


export const getComponent = (property: CollectionProperty, customComponents: Record<string, any>) => {
  const propType = property.type === 'array'
    ? property.items?.type
    : property.type

  // strangely enough this won't work if placed outside function
  const defaultComponents = {
    options: SvOptions,
    select: SvSelect,
    switch: SvSwitch,
    file: SvFile,
    search: SvSearch,
    input: SvInput
  }

  const mappedComponentType = (() => {
    switch( true ) {
      case ['checkbox', 'radio'].includes(property.s$element!):
        return 'options'
      case property.s$element === 'select':
        return 'select'
      case propType === 'boolean':
        return 'switch'
      case property.s$referencedCollection === 'file':
        return 'file'
      case property.s$isReference:
        return 'search'
      case !!property.enum:
        return 'select'

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
  if( property.s$isReference ) {
    const helperStore = useStore(property.s$referencedCollection!)
    const newVal = deepClone(helperStore.$freshItem)
    return modelValue.push(newVal)
  }

  modelValue.push(null)
}

export const spliceFromArray = (modelValue: Array<any>, index: number) => {
  modelValue.splice(index, 1)
}
