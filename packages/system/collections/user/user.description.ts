import { makeDescription, Schema } from '../../../api/core/collection'

export type User = Schema<typeof schema> & {
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
      type: 'text',
    },
    last_name: {
      description: 'Sobrenome',
      type: 'text',
    },
    full_name: {
      description: 'Nome completo',
      type: 'text',
      noform: true
    },
    active: {
      description: 'Ativo',
      type: 'boolean',
      default: true
    },
    role: {
      description: 'Papel',
      type: 'select',
      values: [],
    },
    email: {
      description: 'Email',
      type: 'email',
      unique: true,
    },
    password: {
      description: 'Senha',
      type: 'password',
      hidden: true,
      noform: true
    },
    phone: {
      description: 'Telefone',
      type: 'text',
      mask: '(##) #####-####'
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
      type: 'text',
      noform: true
    },
    self_registered: {
      description: 'Autoregistrado',
      type: 'boolean',
      readOnly: true
    },
    wizard_versions: {
      description: 'Versão do wizard',
      type: 'text',
      array: true
    },
    updated_at: {
      description: 'Atualizado em',
      type: 'datetime',
      meta: true
    },
  }
} as const

export const UserDescription = makeDescription<typeof schema>(schema, {
  presets: [
    'crud',
    'view',
    'duplicate'
  ],
  individualActions: {
    'ui/spawnEdit': {
      name: 'Editar',
      unicon: 'edit',
    },
    'ui/spawnExtra': {
      name: 'Editar detalhes',
      unicon: 'edit'
    },
    'route/dashboard-user-changepass': {
      name: 'Mudar senha',
      unicon: 'key-skeleton',
      fetchItem: true
    },
    delete: {
      name: 'Remover',
      unicon: 'trash-alt',
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
