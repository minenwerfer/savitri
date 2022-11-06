import { CollectionDescription, Schema, SchemaFields } from '../../../api/core/collection'

export type File = Schema<typeof schema>

const file: Partial<File> = {
  mime: 'oi',
  size: 123,
}

const schema = {
  owned: true,
  fields: {
    mime: {
      label: 'Mime',
      type: 'text',
      required: true
    },
    size: {
      label: 'Tamanho',
      type: 'number',
      required: true
    },
    last_modified: {
      label: 'Modificado em',
      type: 'datetime',
      required: true
    },
    filename: {
      label: 'Nome do arquivo',
      type: 'text',
      required: true
    },
    absolute_path: {
      label: 'Caminho absoluto',
      type: 'text'
    },
    relative_path: {
      label: 'Caminho relativo',
      type: 'text'
    },
    immutable: {
      label: 'Imutável',
      type: 'boolean'
    },
    link: {
      label: 'Link',
      type: 'text'
    },
    download_link: {
      label: 'Link de download',
      type: 'text'
    }
  }
} as const

export const Description: CollectionDescription = {
  ...schema as SchemaFields<typeof schema>,
  collection: 'file',
  actions: {
    deleteAll: {
      name: 'Remover',
      ask: true,
      selection: true
    }
  },
  individualActions: {
    remove: {
      name: 'Remover',
      unicon: 'trash-alt',
      ask: true
    }
  },
}
