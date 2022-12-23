import { makeDescription, Schema } from '@savitri/api'

export type Toy = Schema<typeof schema>

const schema = {
  $id: 'toy',
  properties: {
    name: {
      description: 'Name',
      type: 'string'
    },
    price: {
      description: 'Price',
      type: 'number'
    }
  }
} as const

export default makeDescription<typeof schema>(schema)
