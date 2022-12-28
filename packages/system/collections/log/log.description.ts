import { makeDescription, Schema } from '../../../api/core/collection'

export type Log = Schema<typeof schema>

const schema = {
  $id: 'log',
  owned: true,
  properties: {
    context: {
      type: 'string'
    },
    message: {
      type: 'string'
    },
    details: {
      type: 'object'
    }
  }
} as const

export default makeDescription<typeof schema>(schema, {
  presets: [
    'view'
  ],
})
