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
    },
    job: {
      description: 'Job',
      enum: [
        'aviator',
        'doctor',
        'programmer'
      ]
    }
  }
} as const

export default makeDescription<typeof schema>(schema)
