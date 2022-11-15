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
      $ref: '/user',
      description: 'Destinatário',
      index: 'email',
      array: true
    },
    title: {
      description: 'Título',
      type: 'text',
    },
    action: {
      description: 'Ação',
      type: 'text'
    },
    groups: {
      description: 'Grupos',
      type: 'text',
      placeholder: 'Ex.: logistic,producer',
      hint: 'Separados por vírgula, ou vazio'
    },
    subject: {
      description: 'Sujeito',
      type: 'text'
    },
    content: {
      description: 'Conteúdo',
      type: 'textbox',
      notable: true
    }
  }
} as const

export const NotificationDescription = makeDescription<typeof schema>(schema, {
  presets: [
    'crud'
  ],
})
