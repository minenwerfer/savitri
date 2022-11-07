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

export type TypeMapping = Record<string, never> & Flatten<DeepMapping<typeof typeMapping>>

type ValuesOf<T> = T extends readonly string[]
  ? T[number]
  : T[keyof T]

type DeepMapping<T extends Record<string, readonly string[]>> = {
  [P in keyof T]: {
    [K in ValuesOf<T[P]>]: P extends 'String'
      ? string : P extends 'Number'
      ? number : P extends 'Object'
      ? object : P extends 'Boolean'
      ? boolean : P extends 'Date'
      ? Date : never
  }
}

type Flatten<T> = Extract<ValuesOf<{
  [P in keyof T]: {
    [K in keyof T[P]]: K extends ValuesOf<typeof arrayedTypes>
      ? [T[P][K]]
      : T[P][K]
  }
}>, object>
