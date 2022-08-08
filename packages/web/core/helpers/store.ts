import type { CollectionDescription } from '../../../common/types'
import { ARRAY_TYPES } from '../../../common/constants'

export const freshItem = (description: CollectionDescription) => {
  const isObject = (field: any) =>
    typeof field.collection === 'string'
      || field.type === 'object'
      || field.values?.[0]?.__query
      || field.values?.__query

  const item: Record<string, any> = Object.entries(description.fields||{})
    .filter(([, field]: [unknown, any]) => isObject(field))
    .reduce((a, [key, field]: [string, any]) => {
      const isArray = field.array
        || Array.isArray(field.values)

      return {
        ...a,
        [key]: isArray ? [] : {}
      }
    }, {})

  Object.entries(description.fields||{})
    .filter(([, field]: [unknown, any]) => [...ARRAY_TYPES, 'boolean'].includes(field.type))
    .forEach(([key, field] : [string, any]) => {
      item[key] = field.type !== 'radio'
        ? (field.type === 'boolean' ? false : [])
        : ''
    })

  return item
}
