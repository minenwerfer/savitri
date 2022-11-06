import * as bcrypt from 'bcrypt'
import { CollectionDescription } from '../../../common/types'
import { Schema, createModel } from '../../../api/core/collection'

export type User = Schema<typeof ConstDescription>

const user: Partial<User> = {
  first_name: 'oi'
}

const ConstDescription = {
  collection: 'user',
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
      span: 3
    },
    last_name: {
      span: 3
    }
  },
  fields: {
    first_name: {
      label: 'Nome',
      type: 'text',
      required: true
    },
    last_name: {
      label: 'Sobrenome',
      type: 'text',
      required: true
    },
    full_name: {
      label: 'Nome completo',
      type: 'text',
      noform: true
    },
    active: {
      label: 'Ativo',
      type: 'boolean',
      default: true
    },
    role: {
      label: 'Papel',
      type: 'select',
      values: [],
      required: true
    },
    email: {
      label: 'Email',
      type: 'email',
      unique: true,
      required: true
    },
    password: {
      label: 'Senha',
      type: 'password',
      hidden: true,
      noform: true
    },
    phone: {
      label: 'Telefone',
      type: 'text',
      mask: '(##) #####-####'
    },
    picture: {
      collection: 'file',
      label: 'Foto',
      accept: [
        'image/*'
      ]
    },
    group: {
      label: 'Grupo',
      type: 'text',
      noform: true
    },
    self_registered: {
      label: 'Autoregistrado',
      type: 'boolean',
      readOnly: true
    },
    wizard_versions: {
      label: 'Versão do wizard',
      type: 'text',
      array: true
    },
    updated_at: {
      label: 'Atualizado em',
      type: 'datetime',
      meta: true,
      a: 1
    }
  }
} as const

type Aux<
  Left,
  Right extends { [P in keyof Left]: any }
> = {
  readonly [P in keyof Left]: Aux<Left[P], Right[P]>
}

//type Convert<T extends CollectionDescription> = Aux<CollectionDescription, T, T>
const Description: Aux<CollectionDescription, typeof ConstDescription> = ConstDescription

export const UserModel = createModel(Description as CollectionDescription, null, (schema) => { 
  schema.methods.testPassword = async function(candidate: string) {
    return bcrypt.compare(candidate, this.password || '')
  }

  schema.post('init', function(this: User) {
    this.full_name = 'oi'
  })
})
