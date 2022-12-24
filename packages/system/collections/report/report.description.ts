import { makeDescription, Schema } from '../../../api/core/collection'

export type Report = Schema<typeof schema>

const schema = {
  $id: 'report',
  owned: true,
  properties: {
    _collection: {
      description: 'Módulo',
      type: 'string',
      s$translate: true
    },
    created_at: {
      description: 'Data',
      type: 'string',
      format: 'date-time',
      s$meta: true
    },
    file: {
      $ref: 'file',
      description: 'Arquivo',
      s$index: 'name',
      s$notable: true,
      s$noform: true
    },
    format: {
      description: 'Formato',
      enum: [
        'csv',
        'pdf'
      ],
      s$element: 'select'
    },
    type: {
      description: 'Tipo',
      enum: [
        'filtered_only',
        'everything'
      ],
      s$element: 'radio',
      s$translate: true
    },
    limit: {
      description: 'Limite',
      type: 'number',
      s$hint: 'Relatórios com muitas entradas são custosos em termos de processamento, portanto utilize essa opção com cuidado. Verifique antes se já não há um relatório pronto na seção "Relatórios" antes de prosseguir.',
      s$notable: true
    },
    offset: {
      description: 'Offset',
      type: 'number',
      s$hint: 'Deixe vazio para retornar do princípio',
      s$notable: true
    },
    filters: {
      description: 'Filtros',
      type: 'object',
      s$notable: true,
      s$noform: true
    },
    entries_count: {
      description: 'Entradas',
      type: 'number',
      s$noform: true
    }
  }
} as const

export default makeDescription<typeof schema>(schema, {
  icon: 'bag-alt',
  presets: [
    'deleteAll'
  ],
  individualActions: {
    download: {
      name: 'Baixar',
      icon: 'cloud-download'
    },
    delete: {
      name: 'Remover',
      icon: 'trash-alt',
      ask: true
    }
  },
})
