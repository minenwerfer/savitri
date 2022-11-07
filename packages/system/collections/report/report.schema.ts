import { makeDescription, Schema } from '../../../api/core/collection'

export type Report = Schema<typeof schema>

const schema = {
  owned: true,
  fields: {
    _collection: {
      label: 'Módulo',
      type: 'text',
      translate: true
    },
    created_at: {
      label: 'Data',
      type: 'datetime',
      meta: true
    },
    file: {
      collection: 'file',
      label: 'Arquivo',
      index: 'name',
      notable: true,
      noform: true
    },
    format: {
      label: 'Formato',
      type: 'select',
      values: {
        csv: 'CSV',
        pdf: 'PDF'
      }
    },
    type: {
      label: 'Tipo',
      type: 'radio',
      values: {
        filtered_only: 'Apenas resultados filtrados',
        everything: 'Todo o período'
      },
      translate: true
    },
    limit: {
      label: 'Limite',
      description: 'Relatórios com muitas entradas são custosos em termos de processamento, portanto utilize essa opção com cuidado. Verifique antes se já não há um relatório pronto na seção "Relatórios" antes de prosseguir.',
      type: 'number',
      notable: true
    },
    offset: {
      label: 'Offset',
      description: 'Deixe vazio para retornar do princípio',
      type: 'number',
      notable: true
    },
    filters: {
      label: 'Filtros',
      type: 'object',
      notable: true,
      noform: true
    },
    entries_count: {
      label: 'Entradas',
      type: 'number',
      noform: true
    }
  }
} as const

export const ReportDescription = makeDescription<typeof schema>(schema, {
  collection: 'report',
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
