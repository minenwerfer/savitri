import { makeDescription, Schema } from '../../../api/core/collection'

export type User = Omit<Schema<typeof schema>, 'role'> & {
  role: string
  testPassword?(password: string): boolean
}

const schema = {
  $id: 'user',
  required: [
    'first_name',
    'last_name',
    'role',
    'email'
  ],
  properties: {
    first_name: {
      description: 'Nome',
      type: 'string'
    },
    last_name: {
      description: 'Sobrenome',
      type: 'string'
    },
    full_name: {
      description: 'Nome completo',
      type: 'string',
      s$noform: true,
      s$meta: true
    },
    active: {
      description: 'Ativo',
      type: 'boolean',
      default: true
    },
    role: {
      description: 'Papel',
      enum: [],
      s$format: 'select'
    },
    email: {
      description: 'Email',
      type: 'string',
      s$format: 'email',
      s$unique: true,
    },
    password: {
      description: 'Senha',
      type: 'string',
      s$format: 'password',
      s$hidden: true,
      s$noform: true
    },
    phone: {
      description: 'Telefone',
      type: 'string',
      s$mask: '(##) #####-####'
    },
    picture: {
      $ref: 'file',
      description: 'Foto',
      accept: [
        'image/*',
      ]
    },
    group: {
      description: 'Grupo',
      type: 'string',
      s$noform: true
    },
    self_registered: {
      description: 'Autoregistrado',
      type: 'boolean',
      readOnly: true
    },
    wizard_versions: {
      description: 'Versão do wizard',
      type: 'array',
      items: {
        type: 'string'
      },
      s$noform: true
    },
    updated_at: {
      description: 'Atualizado em',
      type: 'string',
      format: 'date-time',
      s$meta: true
    },
  }
} as const

export default makeDescription<typeof schema>(schema, {
  presets: [
    'crud',
    'view',
    'duplicate'
  ],
  individualActions: {
    'ui/spawnEdit': {
      name: 'Editar',
      icon: 'edit',
    },
    'ui/spawnExtra': {
      name: 'Editar detalhes',
      icon: 'edit'
    },
    'route/dashboard-user-changepass': {
      name: 'Mudar senha',
      icon: 'key-skeleton',
      fetchItem: true
    },
    delete: {
      name: 'Remover',
      icon: 'trash-alt',
      ask: true
    }
  },
  searchable: {
    picture: 'picture',
    indexes: [
      'name',
      'phone',
      'email'
    ]
  },
  filters: [
    'first_name',
    'last_name',
    'role',
    'email',
    'phone'
  ],
  table: [
    'full_name',
    'role',
    'picture',
    'active',
    'updated_at'
  ],
  tableMeta: [
    'first_name',
    'last_name'
  ],
  formLayout: {
    first_name: {
      span: 3,
    },
    last_name: {
      span: 3
    }
  }
})
