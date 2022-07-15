import type { CollectionState } from '../../../common/types'
import { proxiedHttp as http } from './_http'

export function state<T=object>(): CollectionState<T> {
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

export const actions = {
  setItem<T>(this: CollectionState<T>, item: T) {
    this.item = item
  },

  setItems<T>(this: CollectionState<T>, items: Array<T>) {
    this.items = items
  },

  clearItem<T=any>(this: CollectionState<T>) {
    this.item = {}
  },

  async describe<T=any>(this: CollectionState<T>) {
    const t = await http.post('/api/test')
    console.log(t)
  }
}
