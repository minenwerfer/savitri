import type { CollectionState, CollectionActions } from '../../../common/types'
import useHttp from './_http'

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
    actions,
    getters
  }
}

const state = <T=object>(): CollectionState<T>|object => {
  return {
    item: {},
    items: [],

    filters: {},
    queryCache: {},
    description: {},
    rawDescription: {},

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

const getters = {
  tableDescription<T=any>(this: Pick<CollectionState<T>, 'description'>) {
    if( !this.description.fields ) {
      return
    }

    const prepare = (value: any) => ({
        ...value,
        label: value.name?.capitalize() || value.label,
        type: value.module ? 'module' : value.type,
    })

    const findField = (fieldName: string) =>
      Object.entries(this.description.fields||{}).find(([key]: [string, unknown]) => fieldName === key)

    if( !!this.description.table ) {
      return this.description.table
        .reduce((a:object, fieldName: string) => {
          const field = findField(fieldName)
          if( !field ) {
            return a
          }

          return {
            ...a,
            [fieldName]: prepare(field[1])
          }
        }, {})
    }

    return Object.entries(this.description.fields)
    .filter(([, value]: [unknown, any]) => !value.hidden && !value.notable)
    .slice(0, 8)
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

