import { makeDescription, Schema } from '@savitri/api'

export type Pet = Schema<typeof schema>

const schema = {
  $id: 'pet',
  properties: {
    name: {
      type: 'string'
    },
    specie: {
      enum: [
        'dog',
        'cat',
        'turtle'
      ]
    },
    favorite_toy: {
      $ref: 'toy',
      s$inline: true
    }
  }
} as const

export default makeDescription<typeof schema>(schema)
