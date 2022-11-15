import { fromEntries, withIsomorphicLock } from '../../../common'
import { ARRAY_TYPES } from '../../../common/constants'
import { useStore } from './'
import useHttp from '../http'

import type {
  CollectionActions,
  CollectionDescription

} from '../../../common/types'

const isObject = (property: any) =>
  typeof property.$ref === 'string'
    || property.type === 'object'
    || property.values?.[0]?.__query
    || property.values?.__query

const isArray = (property: any) => property.array
  || Array.isArray(property.values)


export const hydrateQuery = async(obj: any, array: boolean = false): Promise<any> => {
  const { nonProxiedHttp: http } = useHttp()

  const userStore = useStore('user')
  const normalize = (data: any, query: any) => data.reduce((a: any, item: any) => ({
    ...a,
    [item._id]: item[Array.isArray(query.index)
      ? query.index[0]
      : query.index]
  }), {})

  const hydrate = async ([key, query]: [string, any]) => {
    if( key !== '__query' ) {
      if( array ) {
        return obj
      }

      return {
        [key]: typeof query === 'object'
          ? await hydrateQuery(query, Array.isArray(query))
          : query
      }
    }

    const ref = query.$ref?.split('/').pop() as string
    if( !ref ) {
      throw new TypeError('dynamic query but no ref is specified')
    }

    return withIsomorphicLock(`dynamicQuery:${ref}`, async () => {
      if( !(ref in QUERY_CACHE) ) {
        QUERY_CACHE[ref] = {
          items: [],
          satisfied: false
        }
      }

      const stored = QUERY_CACHE[ref]
      const hasToUpdate = typeof query.limit === 'number'
        && (query.limit > stored.items.length || query.limit === 0)
        && !stored.satisfied

      if( stored.items.length > 0 && !hasToUpdate ) {
        return normalize(stored.items, query)
      }

      if( hasToUpdate && stored ) {
        query.offset = stored.items.length
      }

      /**
       * @remarks optimization
       */
      if( !userStore.$currentUser.role && !query.public ) {
        return {}
      }

      const route = `${ref}/getAll`

      try {
        const options: any = {
          filters: query.filters || {},
          limit: query.limit || 0,
          offset: query.offset,
        }

        if( query.index ) {
          options.project = query.index
          options.sort = Array.isArray(query.index)
            ? query.index.reduce((a: any, index: string) => ({ ...a, [index]: 1 }), {})
            : { [query.index]: 1 }
        }

        const { data } = await http.post(route, options)

        stored.items.push(...data.result)
        stored.satisfied = data.pagination.recordsTotal === query.offset

        const result = normalize(stored.items, query)
        return result

      } catch(e) {
        return stored.items
      }

    })
  }

  const entries = Array.isArray(obj)
    ? obj.map((i) => Object.entries(i)[0])
    : Object.entries(obj)

  const result: any = array ? [] : {}

  for (const pair of entries) {
    const hydrated = await hydrate(pair)

    array
      ? result.push(hydrated)
      : Object.assign(result, hydrated)
  }

  return array
    ? result[0]
    : result
}

export const condenseItem = (item: Record<string, any>) => {
  return Object.entries(item||{}).reduce((a:any, [key, value]) => ({
    ...a,
    [key]: value && typeof value === 'object' && '_id' in value ? { _id: value._id } : value
  }), {})
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
    if( property.values && property.type !== 'boolean' ) {
      property.values = normalizeValues(property.values)
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
  const item: Record<string, any> = Object.entries(description.properties||{}).reduce((a: any, [key, property]) => {
    if( !isObject(property) ) {
      return a
    }

    if( [...ARRAY_TYPES, 'boolean'].includes(property.type!) ) {
      return {
        ...a,
        [key]: property.type !== 'radio'
          ? (property.type === 'boolean' ? false : [])
          : ''
      }
    }

    return {
      ...a,
      [key]: isArray(property) ? [] : {}
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
          [key]: isArray(property) ? [] : {}
        }
      }

      if( property.type === 'datetime' ) {
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
