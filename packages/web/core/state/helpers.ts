import { fromEntries, withIsomorphicLock } from '../../../common'
import { ARRAY_TYPES } from '../../../common/constants'
import { useStore } from './'
import useHttp from '../http'

import type {
  CollectionActions,
  CollectionDescription

} from '../../../common/types'

const isObject = (field: any) =>
  typeof field.collection === 'string'
    || field.type === 'object'
    || field.values?.[0]?.__query
    || field.values?.__query

const isArray = (field: any) => field.array
  || Array.isArray(field.values)


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

    if( !query.collection ) {
      throw new TypeError('dynamic query but no collection is specified')
    }

    return withIsomorphicLock(`dynamicQuery:${query.collection}`, async () => {
      if( !(query.collection in QUERY_CACHE) ) {
        QUERY_CACHE[query.collection] = {
          items: [],
          satisfied: false
        }
      }

      const stored = QUERY_CACHE[query.collection]
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

      const route = `${query.collection}/getAll`

      try {
        const { data } = await http.post(route, {
          filters: query.filters || {},
          project: query.index || {},
          limit: query.limit || 0,
          offset: query.offset
        })

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

export const condenseItem = (item: any) => {
  return Object.entries(item||{})
  .reduce((a:any, [key, value]: [string, any]) => ({
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
  return filters
  .reduce((a: any, b: any) => {
    const filter = typeof b !== 'string'
      ? { [b.field]: b.default||'' }
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

  return Object.entries(values)
  .reduce((a, [key, value]: [string, any]) => ({
    ...a,
    [key]: {
      value: key,
      ...(typeof value === 'string'
        ? { label: value }
        : value)
    }
  }), {})
}

export const normalizeFields = (fields: CollectionDescription['fields']) => {
  return Object.entries(fields||{})
    .reduce((a: object, [fieldName, field]: [string, any]) => {
      if( field.values && field.type !== 'boolean' ) {
        field.values = normalizeValues(field.values)
      }

      if( typeof field.collection === 'string' ) {
        field.type = 'collection'
      }

      field.type ??= 'text'

      return {
        ...a,
        [fieldName]: field
      }
    }, {})
}

export const freshItem = (description: CollectionDescription) => {
  const item: Record<string, any> = Object.entries(description.fields||{})
    .reduce((a: any, [key, field]: [string, any]) => {
      if( !isObject(field) ) {
        return a
      }

      if( [...ARRAY_TYPES, 'boolean'].includes(field.type) ) {
        return {
          ...a,
          [key]: field.type !== 'radio'
            ? (field.type === 'boolean' ? false : [])
            : ''
        }
      }

      return {
        ...a,
        [key]: isArray(field) ? [] : {}
      }
    }, {})

  return item
}

export const freshFilters = (description: CollectionDescription) => {
  return Object.entries(description.fields||{})
    .reduce((a: any, [key, field]: [string, any]) => {
      if( isObject(field) ) {
        return {
          ...a,
          [key]: isArray(field) ? [] : {}
        }
      }

      if( field.type === 'datetime' ) {
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
