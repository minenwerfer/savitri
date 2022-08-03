import { fromEntries, withIsomorphicLock } from '../../../common'
import { useStore } from './'
import useHttp from '../http'

export default () => {
  return {
    hydrateQuery,
    condenseItem,
    removeEmpty
  }
}

const { http } = useHttp()

const hydrateQuery = async(obj: any, array: boolean = false): Promise<any> => {
  const userStore = useStore('user')
  const normalize = (data: any, query: any) => data
    .reduce((a: any, item: any) => ({
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
      if(
        !userStore.$currentUser.access?.capabilities?.[query.collection]?.includes('getAll')
          && !query.public
      ) {
        return {}
      }

      const route = `${query.collection}/getAll`

      const { data } = await http.post(route, {
        filters: query.filters || {},
        project: query.index || {},
        limit: query.limit,
        offset: query.offset
      })

      stored.items.push(...data.result)
      stored.satisfied = data.pagination.recordsTotal === query.offset

      const result = normalize(stored.items, query)

      return result
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

const condenseItem = (item: any) => {
  return Object.entries(item||{})
  .reduce((a:any, [key, value]: [string, any]) => ({
    ...a,
    [key]: value && typeof value === 'object' && '_id' in value ? { _id: value._id } : value
  }), {})
}

const removeEmpty = (item: any) => {
  const entries = Object.entries(item)
  .filter(([_, value]: [unknown, any]) => value && !(typeof value === 'string' && value.length === 0))

  return fromEntries(entries)
}
