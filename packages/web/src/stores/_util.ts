import { fromEntries, withIsomorphicLock } from '../../../common'
import useHttp from './_http'

export default () => {
  return {
    parseQuery,
    condenseItem,
    removeEmpty
  }
}

const { http } = useHttp()

const parseQuery = async(obj: any, array: boolean = false): Promise<any> => {
  const normalize = (data: any, value: any) => data
    .reduce((a: any, item: any) => ({
      ...a,
      [item._id]: item[Array.isArray(value.index) ? value.index[0] : value.index]
    }), {})

  const parse = async ([key, value]: [string, any]) => {
    if( key !== '__query' ) {
      if( array ) {
        return obj
      }

      return {
        [key]: typeof value === 'object'
          ? await parseQuery(value, Array.isArray(value))
          : value
      }
    }

    if( !value.collection ) {
      throw new TypeError('dynamic query but no collection is specified')
    }

    return withIsomorphicLock(`dynamicQuery:${value.collection}`, async () => {
      const stored = window._queryCache?.[value.collection]||[]
      const hasToUpdate = typeof value.limit === 'number'
        && (value.limit > stored.length || value.limit === 0)

      if( stored?.length > 0 && !hasToUpdate ) {
        return normalize(stored, value)
      }

      if( hasToUpdate && stored ) {
        value.offset = stored.length
      }

      /**
       * @remarks This empty entry will prevent duplicate requests.
       */
      if( !window._queryCache ) {
        window._queryCache = {}
      }

      /**
       * @remarks optimization
       */
      if( !sessionStorage.getItem('auth:token') && !value.public ) {
        return {}
      }

      const route = `${value.collection}/getAll`

      const { data } = await http.post(route, {
        filters: value.filters || {},
        project: value.index || {},
        limit: value.limit,
        offset: value.offset
      })

      const result = normalize([
        ...stored,
        ...data.result
      ], value)

      // window.dispatchEvent(new CustomEvent('__updateQueryCache', {
      //   detail: {
      //     parentModule: this._route,
      //     moduleName: value.collection,
      //     result: data.result
      //   }
      // }))

      return result
    })
  }

  const entries = Array.isArray(obj)
    ? obj.map((i) => Object.entries(i)[0])
    : Object.entries(obj)

  const result: any = array ? [] : {}

  for (const pair of entries) {
    const parsed = await parse(pair)

    array
      ? result.push(parsed)
      : Object.assign(result, parsed)
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
