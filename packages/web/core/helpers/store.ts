import type { CollectionDescription } from '../../../common/types'
import { ARRAY_TYPES } from '../../../common/constants'

export const freshItem = (description: CollectionDescription) => {
  const item: Record<string, any> = Object.entries(description.fields||{})
  .filter(([, value]: [unknown, any]) => typeof value.collection === 'string' || value.type === 'object')
  .reduce((a, [key, value]: [string, any]) => ({
    ...a,
    [key]:  value.array ? [] : {}
  }), {})

  Object.entries(description.fields||{})
  .filter(([, value]: [unknown, any]) => [...ARRAY_TYPES, 'boolean'].includes(value.type))
  .forEach(([key, value] : [string, any]) => {
    item[key] = value.type !== 'radio'
      ? (value.type === 'boolean' ? false : [])
      : ''
  })

  return item
}
