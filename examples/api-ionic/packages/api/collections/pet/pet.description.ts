import { makeDescription, Schema } from '@savitri/api'

export type Pet = Schema<typeof schema>

const schema = {
  $id: 'pet',
  properties: {
    name: {
      description: 'Name',
      type: 'string'
    },
    specie: {
      description: 'Specie',
      enum: [
        'dog',
        'cat',
        'turtle'
      ]
    },
    favorite_toy: {
      description: 'Favorite toy',
      $ref: 'toy',
      s$inline: true
    }
  }
} as const

export default makeDescription<typeof schema>(schema)
