import { CollectionDescription } from '../../../common/types'
import { Schema, createModel } from '../../../api/core/collection'
import '../user/user.model'

export type File = Schema<typeof ConstDescription>

const file: Partial<File> = {
  mime: 'oi',
  size: 123
}

const ConstDescription = {
  collection: 'file',
  route: true,
  presets: [
    'owned'
  ],
  methods: [
    'insert',
    'delete'
  ],
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

export default createModel(Description, null, (schema) => {
  schema.post('init', async function() {
    const timestamp = this.last_modified
      ? new Date(this.last_modified).getTime()
      : 'fresh'

    const link = `${process.env.API_URL}/file/${this._id}`

    this.link = `${link}?${timestamp}`
    this.download_link = `${link}/download?${timestamp}`
  })
})

