import * as Collection from '../../../common/src/collection'
import { fromEntries } from '../../../common'
import type { CollectionDescription, CollectionField } from '../../../common/types'
import type {
  CollectionState,
  CollectionGetters,
  PiniaState,
  Pagination

} from '../../types/store'

import useHttp from '../http'
import useMetaStore from './meta'

type CollectionStateItem<T> =
  Pick<CollectionState<T>, 'item'>

type CollectionStateItems<T> =
  Pick<CollectionState<T>, 'items'>

type CrudParameters = {
  filters: any
  limit: number
  offset: number
}

type ActionFilter = Pick<CrudParameters, 'filters' | 'limit' | 'offset'>

const { http } = useHttp()

const mutations = {
  setItem<T>(
    this: CollectionStateItem<T>,
    item: T
  ) {
    this.item = item
  },

  setItems<T>(
    this: CollectionStateItems<T>,
    items: Array<T>
  ) {
    this.items = items
  },

  clearItem<T=any>(this: CollectionStateItem<T>) {
    this.item = {}
  },

  clearItems<T=any>(this: CollectionStateItems<T>) {
    this.items = []
  },

  async describe<T=any>(this: CollectionState<T>) {
    const t = await http.post(`${this.$id}/describe`)
    console.log(t)
  }
}

export default {
  ...mutations,
  async custom<T extends PiniaState>(this: CollectionState<T>, verb: string, payload: any): Promise<any> {
    return (await http.post(`${this.$id}/${verb}`, payload)).data
  },

  async customEffect(
    this: { custom: (...args: any[]) => Promise<any> },
    verb: string,
    payload: any,
    fn: (data: any) => any
  ): Promise<any> {
    return fn(await this.custom(verb, payload))
  },

  async get<T>(payload: ActionFilter): Promise<T> {
    return this.customEffect(
      'get', payload,
      this.setItem
    )
  },

  async getAll<T>(
    this: {
      $patch: (...args: any[]) => void
      customEffect: (...args: any[]) => Promise<any>
    },
    payload: ActionFilter
  ): Promise<Array<T>> {
    return this.customEffect(
      'getAll', payload,
      ({ result, pagination }: { result: Array<T>, pagination: Pagination }) => {
        this.$patch({
          items: result,
          pagination
        })
      }
    )
  },

  async insert<T>(
    this: {
      item: CollectionState<T>['item']
      customEffect: (...args: any[]) => Promise<any>
      setItem: (item: T) => void
    },
    payload: { what?: Partial<T> }
  ): Promise<T> {
    return this.customEffect(
      'insert', { ...payload, what: payload.what||this.item },
      this.setItem
    )
  },

  filter<T>(
    this: {
      $filters: CollectionGetters['$filters']
      pagination: CollectionState<T>['pagination']
      getAll: (...args: any[]) => Promise<Array<T>>
    }
  ) {
    return this.getAll({
      filters: this.$filters,
      limit: this.pagination.limit
    })
  },

  clearFilters<T>(
    this: Pick<CollectionState<T>, 'filters'> & {
      filter: (...args: any[]) => Promise<Array<T>>
    }
  ) {
    this.filters = {}
    this.filter()
  },

  async ask(props: {
    action: (params: any) => unknown, params: any
    title?: string
    body?: string
  }) {
    const metaStore = useMetaStore()
    metaStore.spawnPrompt({
      title: props.title || 'Diálogo de confirmação',
      body: props.body,
      actions: [
        { name: 'cancel', title: 'Cancelar' },
        { name: 'confirm', title: 'Confirmar', type: 'critical' },
      ]
    })

    const { action, params } = props
    return action(params)
  },

  useFields(
    this: Pick<CollectionGetters, 'fields'>,
    fields: Array<string>,
  ): Record<string, CollectionField> {
    return fromEntries(Object.entries(this.fields)
      .filter(([key]: [string, unknown]) => fields.includes(key)))
  },

  useFieldsExcept(
    this: Pick<CollectionGetters, 'fields'>,
    fields: Array<string>
  ): Record<string, CollectionField> {
    return fromEntries(Object.entries(this.fields)
      .filter(([key]: [string, unknown]) => !fields.includes(key)))
  },

  formatValue<T>(
    this: Pick<CollectionState<T>, 'rawDescription'>,
    args: {
      value: string|object,
      key: string,
      form: boolean,
      field: CollectionField
    }
  ): string
    {
      return Collection.formatValue(
        this.rawDescription as Pick<CollectionDescription, 'fields'>,
        args.value,
        args.key,
        args.form,
        args.field
      )
  },

  getIndexes<T>(
    this: Pick<CollectionState<T>, 'rawDescription'>,
    args:  { key: string, form: boolean }
  ): Array<string> {
    return Collection.getIndexes(
      this.rawDescription as Pick<CollectionDescription, 'fields'>,
      args.key,
      args.form
    )
  }
}
