import { fromEntries } from '../../../common'

import type {
  CollectionActions,
  CollectionDescription

} from '../../../types'

const isObject = (property: any) =>
  property.$ref
    || property.type === 'object'
    || property.items?.$ref
    || property.items?.type === 'object'


export const condenseItem = (item: Record<string, any>): Record<string, Exclude<any, '_id'>> => {
  return Object.entries(item||{}).reduce((a:any, [key, value]) => {
    if( Array.isArray(value) ) {
      return {
        ...a,
        [key]: value.map(v => v._id||v)
      }
    }

    return {
      ...a,
      [key]: value && typeof value === 'object' && '_id' in value
        ? { _id: value._id }
        : value
    }
  }, {})
}

export const removeEmpty = (item: any) => {
  const entries = Object.entries(item)
  .filter(([_, value]: [unknown, any]) => value)

  return fromEntries(entries)
}


export const normalizeActions = (actions: CollectionActions) => Object.entries(actions||{})
  .reduce((a: Array<object>, [key, value]) => {
    if( !value || key.startsWith('_') ) {
      return a
    }

    return [
      ...a,
      {
        action: key,
        ...value
      }
  ]
  }, [])

export const normalizeFilters = (filters: Array<any>) => {
  return filters.reduce((a: any, b) => {
    const filter = typeof b !== 'string'
      ? { [b.property]: b.default||'' }
      : { [b]: '' }

      return {
        ...a,
        ...filter
      }
  }, {})
}

export const normalizeValues = (values: any|Array<any>) => {
  if( Array.isArray(values) ) {
    return values.reduce((a, value) => ({
      ...a,
      [value]: {
        value,
        label: value
      }
    }), {})
  }

  return Object.entries(values).reduce((a, [key, value]: [string, any]) => ({
    ...a,
    [key]: {
      value: key,
      ...(typeof value === 'string'
        ? { label: value }
        : value)
    }
  }), {})
}

export const normalizeProperties = (properties: CollectionDescription['properties']) => {
  return Object.entries(properties||{}).reduce((a: object, [propertyName, property]: [string, any]) => {
    if( property.enum && property.type !== 'boolean' ) {
      property.enum = normalizeValues(property.enum)
    }

    if( typeof property.collection === 'string' ) {
      property.type = 'collection'
    }

    property.type ??= 'text'

    return {
      ...a,
      [propertyName]: property
    }
  }, {})
}

export const freshItem = (description: CollectionDescription) => {
  const item: Record<string, any> = Object.entries(description.properties).reduce((a: any, [key, property]) => {
    if( !isObject(property) ) {
      return a
    }

    const value = (() => {
      if( property.$ref ) {
        return {}
      }

      switch( property.type ) {
        case 'boolean': return false
        case 'array': return []
        case 'object': return {}
        default: return null
      }
    })()

    return {
      ...a,
      [key]: value
    }
  }, {})

  return item
}

export const freshFilters = (description: CollectionDescription) => {
  return Object.entries(description.properties||{})
    .reduce((a: any, [key, property]: [string, any]) => {
      if( isObject(property) ) {
        return {
          ...a,
          [key]: property.type === 'array' ? [] : {}
        }
      }

      if( ['date', 'date-time'].includes(property.format) ) {
        return {
          ...a,
          [key]: {
            $gte: '',
            $lte: ''
          }
        }
      }

      return a
    }, {})
}
