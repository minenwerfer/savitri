import { makeDescription, Schema } from '../../../api/core/collection'

export type File = Schema<typeof schema>

const schema = {
  $id: 'file',
  owned: true,
  presets: [
    'owned'
  ],
  required: [
    'size',
    'last_modified',
    'filename',
    'mime'
  ],
  indexes: [
    'filename',
    'link'
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
      type: 'string',
      s$meta: true
    },
    download_link: {
      description: 'Link de download',
      type: 'string',
      s$meta: true
    }
  },
} as const

export default makeDescription<typeof schema>(schema, {
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
      icon: 'trash-alt',
      ask: true
    }
  },
})
