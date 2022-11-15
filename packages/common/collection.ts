import type {
  CollectionDescription,
  CollectionProperty,
  CollectionReference

} from './types'

export const getReferencedCollection = (property: CollectionProperty): CollectionReference|null => {
  const query = Array.isArray(property.values)
    ? property.values?.[0]?.__query
    : property.values?.__query

  const reference = query || Object.assign({}, property)
  return reference?.$ref
    ? reference
    : null
}

export function getIndexes(
  description: Pick<CollectionDescription, 'properties'>,
  key: string
): Array<string> {
  const property = description.properties?.[key]
  const { $ref, index, } = getReferencedCollection(property)||{}

  if( !$ref || !index ) {
    return []
  }

  return Array.isArray(index)
    ? index
    : [index]
}

export const getFirstIndex = (
  description: Pick<CollectionDescription, 'properties'>,
  key: string
): string => {
  const properties = getIndexes(description, key)||[]
  return properties[0]
}

export const getFirstValue = (
  description: Pick<CollectionDescription, 'properties'>,
  value: any,
  key: string
): string|number|null => {
  if( !value ) {
    return '-'
  }

  const firstProperty = getFirstIndex(description, key)
  const extract = (v: any) => typeof v === 'object' || firstProperty
    ? v[firstProperty]
    : v

  const firstValue = Array.isArray(value)
    ? value.map((v: any) => extract(v)).join(', ')
    : extract(value)

  return firstValue
}

export const formatValue = (
  description: Pick<CollectionDescription, 'properties'>,
  value: any,
  key: string,
  property?: CollectionProperty
): string => {
  const firstValue = value && typeof value === 'object' && !(value instanceof Date)
    ? ((Array.isArray(value) || value?._id) ? getFirstValue(description, value, key) : Object.values(value)[0])
    : value

  const formatted = (() => {
    switch(true) {
      case property?.type === 'datetime':
        return (String(firstValue) as any).formatDateTime(property?.includeHours)

      case property?.type === 'boolean': return firstValue ? 'true' : 'false'
      case [undefined, null].includes(firstValue): return '-'
      default: return firstValue
    }
  })()

  return String(formatted)
}
