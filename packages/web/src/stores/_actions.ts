import * as Collection from '../../../common/src/collection'
import type { CollectionDescription, CollectionField } from '../../../common/types'
import type { CollectionState, CollectionStoreActions } from '../../types/store'
import useHttp from '../http'

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
  async custom(this: any, verb: string, payload: any): Promise<any> {
    return (await http.post(`${this.$id}/${verb}`, payload)).data?.result
  },

  async customEffect(
    verb: string,
    payload: string,
    fn: (result: any) => any
  ): Promise<any> {
    return fn(await this.custom(verb, payload))
  },

  async get<T>(this: CollectionStoreActions, payload: ActionFilter): Promise<T> {
    return this.customEffect(
      'get', payload,
      this.setItem
    )
  },

  async getAll<T>(this: CollectionStoreActions, payload: ActionFilter): Promise<Array<T>> {
    return this.customEffect(
      'getAll', payload,
      this.setItems
    )
  },

  clearFilters<T>(this: Pick<CollectionState<T>, 'filters'>) {
    this.filters = {}
  },

  formatValue<T>(
    this: Pick<CollectionState<T>, 'rawDescription'>,
    args: { value: string|object, key: string, form: boolean, field: CollectionField }): string
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
