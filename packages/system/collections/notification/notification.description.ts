import { makeDescription, Schema } from '../../../api/core/collection'

export type Notification = Schema<typeof schema>

const schema = {
  $id: 'notification',
  owned: true,
  required: [
    'title'
  ],
  properties: {
    destination: {
      description: 'Destinatário',
      type: 'array',
      items: {
        $ref: 'user'
      },
      s$indexes: 'email'
    },
    title: {
      description: 'Título',
      type: 'string',
    },
    action: {
      description: 'Ação',
      type: 'string'
    },
    groups: {
      description: 'Grupos',
      type: 'string',
      s$placeholder: 'Ex.: logistic,producer',
      s$hint: 'Separados por vírgula, ou vazio'
    },
    subject: {
      description: 'Sujeito',
      type: 'string'
    },
    content: {
      description: 'Conteúdo',
      type: 'string',
      s$element: 'textarea',
      s$notable: true
    }
  }
} as const

export default makeDescription<typeof schema>(schema, {
  presets: [
    'crud'
  ],
})
