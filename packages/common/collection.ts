import type { CollectionDescription, CollectionField } from './types'

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
  const extract = (v: any) => typeof v === 'object' || firstField
    ? v[firstField]
    : v

  const firstValue = Array.isArray(value)
    ? value.map((v: any) => extract(v)).join(', ')
    : extract(value)

  return firstValue
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
        return (String(firstValue) as any).formatDateTime(field?.includeHours)

      case field?.type === 'boolean': return firstValue ? 'true' : 'false'
      case [undefined, null].includes(firstValue): return '-'
      default: return firstValue
    }
  })()

  return String(formatted)
}

export const getItemIndex = <T extends { _id: string }>(item: any, items?: Array<T>) => {
  const _id = typeof item === 'object'
    ? item._id
    : item

  return (items||[])
    .sort((a: any, b: any) => a._id > b._id ? -1 : 1)
    .findIndex((i: any) => i._id === _id) + 1
}
