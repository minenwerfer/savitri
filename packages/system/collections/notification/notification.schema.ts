import { CollectionDescription, Schema, SchemaFields } from '../../../api/core/collection'

export type Notification = Schema<typeof schema>

const schema = {
  owned: true,
  fields: {
    destination: {
      collection: 'user',
      label: 'Destinatário',
      index: 'email',
      array: true
    },
    title: {
      label: 'Título',
      type: 'text',
      required: true
    },
    action: {
      label: 'Ação',
      type: 'text'
    },
    groups: {
      label: 'Grupos',
      type: 'text',
      placeholder: 'Ex.: logistic,producer',
      description: 'Separados por vírgula, ou vazio'
    },
    subject: {
      label: 'Sujeito',
      type: 'text'
    },
    content: {
      label: 'Conteúdo',
      type: 'textbox',
      notable: true
    }
  }
} as const

export const Description: CollectionDescription = {
  ...schema as SchemaFields<typeof schema>,
  collection: 'notification',
  presets: [
    'crud'
  ],
}
