import { makeDescription, Schema } from '../../../api/core/collection'

export type Report = Schema<typeof schema>

const schema = {
  $id: 'report',
  owned: true,
  properties: {
    _collection: {
      description: 'Módulo',
      type: 'text',
      translate: true
    },
    created_at: {
      description: 'Data',
      type: 'datetime',
      meta: true
    },
    file: {
      $ref: 'file',
      description: 'Arquivo',
      index: 'name',
      notable: true,
      noform: true
    },
    format: {
      description: 'Formato',
      type: 'select',
      values: {
        csv: 'CSV',
        pdf: 'PDF'
      }
    },
    type: {
      description: 'Tipo',
      type: 'radio',
      values: {
        filtered_only: 'Apenas resultados filtrados',
        everything: 'Todo o período'
      },
      translate: true
    },
    limit: {
      description: 'Limite',
      hint: 'Relatórios com muitas entradas são custosos em termos de processamento, portanto utilize essa opção com cuidado. Verifique antes se já não há um relatório pronto na seção "Relatórios" antes de prosseguir.',
      type: 'number',
      notable: true
    },
    offset: {
      description: 'Offset',
      hint: 'Deixe vazio para retornar do princípio',
      type: 'number',
      notable: true
    },
    filters: {
      description: 'Filtros',
      type: 'object',
      notable: true,
      noform: true
    },
    entries_count: {
      description: 'Entradas',
      type: 'number',
      noform: true
    }
  }
} as const

export const ReportDescription = makeDescription<typeof schema>(schema, {
  unicon: 'bag-alt',
  presets: [
    'deleteAll'
  ],
  individualActions: {
    download: {
      name: 'Baixar',
      unicon: 'cloud-download'
    },
    delete: {
      name: 'Remover',
      unicon: 'trash-alt',
      ask: true
    }
  },
})
