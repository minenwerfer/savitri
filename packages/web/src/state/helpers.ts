import type { CollectionActions, Description } from '@semantic-api/types'

const isObject = (property: any) =>
  property.$ref
    || property.type === 'object'
    || property.items?.$ref
    || property.items?.type === 'object'


export const condenseItem = (item: Record<string, any>): Record<string, Exclude<any, '_id'>> => {
  return Object.entries(item||{}).reduce((a, [key, value]) => {
    if( Array.isArray(value) ) {
      return {
        ...a,
        [key]: value.map(v => v?._id||v)
      }
    }

    if(
      value instanceof Object
        && !(value instanceof Date)
        && !Object.keys(value).length
    ) {
      return a
    }

    return {
      ...a,
      [key]: value?._id || value
    }
  }, {})
}

export const isNull = (value: any) => [undefined, null, ''].includes(value)

export const removeEmpty = (item: any) => {
  const entries = Object.entries(item)
    .filter(([_, value]: [unknown, any]) => !isNull(value))

  return Object.fromEntries(entries)
}


export const normalizeActions = (actions: CollectionActions<any>) => Object.entries(actions||{})
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

export const normalizeFilters = (filters: Description['filters']) => {
  return filters?.reduce((a, b) => {
    const filter = typeof b === 'object'
      ? { [b.property]: b.default||'' }
      : { [b]: '' }

      return {
        ...a,
        ...filter
      }
  }, {}) || {}
}

export const freshItem = (description: Description) => {
  const item: Record<string, any> = Object.entries(description.properties).reduce((a, [key, property]) => {
    const value = (() => {
      if( property.$ref ) {
        return {}
      }

      switch( property.type ) {
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

  if( description.freshItem ) {
    Object.assign(item, description.freshItem)
  }

  return item
}

export const freshFilters = (description: Description) => {
  return Object.entries(description.properties||{})
    .reduce((a, [key, property]) => {
      if( isObject(property) ) {
        return {
          ...a,
          [key]: property.type === 'array' ? [] : {}
        }
      }

      if( ['date', 'date-time'].includes(property.format!) ) {
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

