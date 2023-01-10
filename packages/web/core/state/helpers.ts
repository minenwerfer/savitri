import * as R from 'ramda'
import type { CollectionActions, Description } from '@semantic-api/types'
import { fromEntries } from '@semantic-api/common'

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
  return filters.reduce((a, b) => {
    const filter = typeof b !== 'string'
      ? { [b.property]: b.default||'' }
      : { [b]: '' }

      return {
        ...a,
        ...filter
      }
  }, {})
}

export const freshItem = (description: Description) => {
  const item: Record<string, any> = Object.entries(description.properties).reduce((a, [key, property]) => {
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


export const deepDiff = <T extends Record<string, any>>(origin: T, target: T, preserveIds?: boolean) => {
  const changes = (target: T, origin: T): any => {
    const diff = Object.entries(target).reduce((a: any, [key, value]) => {
      const isUnequal = (() => {
        if( Array.isArray(value) && Array.isArray(origin[key]) ) {
          return !value.every((v, i) => (v === null && i !== value.length-1) || R.equals(origin[key][i], v))
            || value.length < origin[key].length
        }

        return value !== origin[key]
          && (typeof value !== 'number' && (value || origin[key]))
      })()

      if( isUnequal ) {
        if( R.is(Object, value) && R.is(Object, origin[key]) ) {
          const res = changes(value, origin[key])

          if( Array.isArray(value) ) {
            a[key] = value.length < origin[key].length
              ? origin[key]
              : value.map((v, index) => res[+index] || v)

            return a
          }

          if( !Object.keys(res).length ) {
            return a
          }

          return {
            ...a,
            [key]: res
          }
        }

        return {
          ...a,
          [key]: value
        }
      }

      return a
    }, {})

    if( preserveIds && target._id && Object.keys(diff).length > 0 ) {
      diff._id = target._id
    }

    return diff
  }

  return changes(target, origin)
}
