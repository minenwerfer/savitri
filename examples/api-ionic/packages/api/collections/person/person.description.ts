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
      type: 'number'
    },
    active: {
      description: 'Active',
      type: 'boolean'
    },
    job: {
      description: 'Job',
      type: 'array',
      items: {
        enum: [
          'aviator',
          'doctor',
          'programmer'
        ],
      },
      s$format: 'select'
    },
    pet: {
      description: 'Pets',
      type: 'array',
      items: {
        $ref: 'pet'
      },
      s$inline: true
    }
  }
} as const

export default makeDescription<typeof schema>(schema)
