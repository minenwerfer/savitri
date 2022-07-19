import type {
  CollectionState,
  CollectionActions,
  PiniaState

} from '../../../common/types'

import useHttp from './_http'
// import { mutations } from './_mutations'

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

export default () => {
  return {
    state,
    mutations,
    actions
  }
}

function state<T=object>(): CollectionState<T>|object {
  return {
    item: {},
    items: [],

    filters: {},
    queryCache: {},
    description: {},

    meta: {
      isLoading: false,
      halt: false
    },

    pagination: {
      limit: 0,
      recordsCount: 0,
      recordsTotal: 0,
      currentPage: 0
    }
  }
}

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

const actions = {
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

  async get<T>(this: CollectionActions, payload: ActionFilter): Promise<T> {
    return this.customEffect(
      'get', payload,
      this.setItem
    )
  },

  async getMany<T>(this: CollectionActions, payload: ActionFilter): Promise<Array<T>> {
    return this.customEffect(
      'getAll', payload,
      this.setItems
    )
  },
}
