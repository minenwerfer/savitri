import type { MakeMapping } from './typemapping.types'

export const typeMapping = {
  String: [
    'text',
    'email',
    'password',
    'radio',
    'select',
    'checkbox'
  ],
  Number: [
    'number',
    'integer'
  ],
  Object: [
    'object'
  ],
  Boolean: [
    'boolean'
  ],
  Date: [
    'datetime'
  ]
} as const

export const arrayedTypes = [
  'checkbox'
] as const

export type TypeMapping = Record<string, never> & MakeMapping<
  typeof typeMapping,
  typeof arrayedTypes
>
