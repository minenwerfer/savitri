import { makeDescription, Schema } from '../../../api/core/collection'

export type File = Schema<typeof schema>

const schema = {
  $id: 'file',
  owned: true,
  required: [
    'size',
    'last_modified',
    'filename',
    'mime'
  ],
  properties: {
    mime: {
      description: 'Mime',
      type: 'string',
    },
    size: {
      description: 'Tamanho',
      type: 'number',
    },
    last_modified: {
      description: 'Modificado em',
      type: 'string',
      format: 'date-time'
    },
    filename: {
      description: 'Nome do arquivo',
      type: 'string',
    },
    absolute_path: {
      description: 'Caminho absoluto',
      type: 'string'
    },
    relative_path: {
      description: 'Caminho relativo',
      type: 'string'
    },
    immutable: {
      description: 'Imutável',
      type: 'boolean'
    },
    link: {
      description: 'Link',
      type: 'string'
    },
    download_link: {
      description: 'Link de download',
      type: 'string'
    }
  },
} as const

export const FileDescription = makeDescription<typeof schema>(schema, {
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
})
