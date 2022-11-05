import type {
  CollectionDescription,
  CollectionField,
  CollectionReference

} from './types'

export const getReferencedCollection = (field: CollectionField): CollectionReference|null => {
  const query = Array.isArray(field.values||[])
    ? (field.values||[{}])[0]?.__query
    : field.values?.__query

  const reference = query || field
  if( !reference.collection ) {
    return null
  }

  return query || Object.assign({}, field)
}

export function getIndexes(
  description: Pick<CollectionDescription, 'fields'>,
  key: string
): Array<string> {
  const field = description.fields?.[key]
  const {
    collection,
    index,

  } = getReferencedCollection(field)||{}

  if( !collection || !index ) {
    return []
  }

  return Array.isArray(index)
    ? index
    : [index]
}

export const getFirstIndex = (
  description: Pick<CollectionDescription, 'fields'>,
  key: string
): string => {
  const fields = getIndexes(description, key)||[]
  return fields[0]
}

export const getFirstValue = (
  description: Pick<CollectionDescription, 'fields'>,
  value: any,
  key: string
): string|number|null => {
  if( !value ) {
    return '-'
  }

  const firstField = getFirstIndex(description, key)
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
  field?: CollectionField
): string => {
  const firstValue = value && typeof value === 'object' && !(value instanceof Date)
    ? ((Array.isArray(value) || value?._id) ? getFirstValue(description, value, key) : Object.values(value)[0])
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
