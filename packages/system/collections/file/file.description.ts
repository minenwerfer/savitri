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
      type: 'text',
    },
    size: {
      description: 'Tamanho',
      type: 'number',
    },
    last_modified: {
      description: 'Modificado em',
      type: 'datetime',
    },
    filename: {
      description: 'Nome do arquivo',
      type: 'text',
    },
    absolute_path: {
      description: 'Caminho absoluto',
      type: 'text'
    },
    relative_path: {
      description: 'Caminho relativo',
      type: 'text'
    },
    immutable: {
      description: 'Imutável',
      type: 'boolean'
    },
    link: {
      description: 'Link',
      type: 'text'
    },
    download_link: {
      description: 'Link de download',
      type: 'text'
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
