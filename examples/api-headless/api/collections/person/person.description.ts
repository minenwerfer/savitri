import { makeDescription, Schema } from '@savitri/api'

export type Person = Schema<typeof schema>

const schema = {
  $id: 'person',
  properties: {
    name: {
      description: 'Name',
      type: 'string'
    },
    age: {
      description: 'Age',
      type: 'string'
    }
  }
} as const

export const PersonDescription = makeDescription<typeof schema>(schema)
