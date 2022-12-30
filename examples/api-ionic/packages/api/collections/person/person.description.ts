import { makeDescription, Schema } from '@savitri/api'

export type Person = Schema<typeof schema>

const schema = {
  $id: 'person',
  properties: {
    name: {
      type: 'string'
    },
    age: {
      type: 'number'
    },
    active: {
      type: 'boolean'
    },
    job: {
      type: 'array',
      items: {
        enum: [
          'aviator',
          'doctor',
          'programmer'
        ],
      },
      s$element: 'select',
    },
    pets: {
      type: 'array',
      items: {
        $ref: 'pet'
      },
      s$inline: true
    }
  }
} as const

export default makeDescription<typeof schema>(schema)
