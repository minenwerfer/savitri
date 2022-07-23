import type { CollectionDescription, CollectionField } from '../types'

export function getIndexes(
  description: Pick<CollectionDescription, 'fields'>,
  key: string,
  form: boolean = false
): Array<string> {
  const reference = description.fields?.[key]
  const query:any = {}

  // retrieves index if dynamic querying is used
  if( reference?.values ) {
    // values can be either arrays or objects
    const prop = Array.isArray(reference.values)
      ? reference.values.find((e: any) => Object.keys(e)[0] === '__query')?.__query
      : reference.values.__query

    Object.assign(query, prop||{})
  }

  const {
    collection,
    index,
    formIndex

  } = query.collection ? query : (reference||{})

  if( key === 'products' ) {
    console.log({ description2: description })
    console.log(query)
    console.log(reference)
  }


  if( !collection ) {
    return []
  }

  const field = (form ? (formIndex || index) : index) || Object.keys(description.fields)[0]
  return Array.isArray(field) ? field : [field]
}

export const getFirstIndex = (
  description: Pick<CollectionDescription, 'fields'>,
  key: string,
  form: boolean = false
): string => {
  const fields = getIndexes(description, key, form)||[]
  return fields[0]
}

export const getFirstValue = (
  description: Pick<CollectionDescription, 'fields'>,
  value: any,
  key: string,
  form: boolean = false,
): string|number|null => {
  if( !value ) {
    return '-'
  }

  const firstField = getFirstIndex(description, key, form)
  if( key === 'products' ) {
    console.log(
      '============ OUTRA LINHA ANIMAL'
    )
  }

  const extract = (v: any) => typeof v === 'object' || firstField
    ? v[firstField]
    : v

  const firstValue = Array.isArray(value)
    ? value.map((v: any) => extract(v)).join(', ')
    : extract(value)

  return firstValue

  // return firstValue && typeof firstValue === 'object'
  //   ? getFirstValue(description, firstValue, firstField, form, collectionName)
  //   : firstValue
}

export const formatValue = (
  description: Pick<CollectionDescription, 'fields'>,
  value: any,
  key: string,
  form: boolean = false,
  field?: CollectionField
): string => {
  const firstValue = value && typeof value === 'object' && !(value instanceof Date)
    ? ((Array.isArray(value) || value?._id) ? getFirstValue(description, value, key, form) : Object.values(value)[0])
    : value

  const formatted = (() => {
    switch(true) {
      case field?.type === 'datetime':
        return firstValue
          ? (String(firstValue) as any).formatDateTime(field?.includeHours)
          : '-'

      case field?.type === 'boolean': return firstValue ? 'sim' : 'não'
      case [undefined, null].includes(firstValue): return '-'
      default: return firstValue
    }
  })()

  return ![undefined, null].includes(formatted)
    ? String(formatted)
    : '-'
}

// export const resumeItem = (description: any, item: any) => {
//   return Object.entries(item||{})
//   .reduce((a: object, [key, value]: [string, any]) => ({
//     ...a,
//     [key]: value && typeof value === 'object' && '_id' in value
//       ? getFirstValue(description, value, key)
//       : value
//   }), {})
// }

export const getItemIndex = <T extends { _id: string }>(item: any, items?: Array<T>) => {
  const _id = typeof item === 'object'
    ? item._id
    : item

  return (items||[])
    .sort((a: any, b: any) => a._id > b._id ? -1 : 1)
    .findIndex((i: any) => i._id === _id) + 1
}

export const action = (moduleName: string, store: any, router: any) =>
  async (action: string, actionProps: any, filters: any) => {
  if( action.split('/')[0] === 'route' ) {
    await store.dispatch(`${moduleName}/get`, { filters: { _id: filters._id } })
    return router.push({ name: action.split('/')[1], params: { id: filters._id } })
  }

  return actionProps.ask
    ? store.dispatch(`${moduleName}/ask`, { action, params: { payload: { filters }}})
    : store.dispatch(`${moduleName}/${action}`, { payload: { filters  }})
}
