import type { CollectionState } from '../../../common/types'
import { proxiedHttp as http } from './_http'
import { mutations } from './_mutations'

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
    mutations.ITEM_GET(this, item)
  },

  setItems<T>(this: CollectionState<T>, items: Array<T>) {
    mutations.ITEMS_GET(this, items)
  },

  clearItem<T=any>(this: CollectionState<T>) {
    mutations.ITEM_CLEAR(this)
  },

  async describe<T=any>(this: CollectionState<T>) {
    const t = await http.post(`${this.$id}/describe`)
    console.log(t)
  }
}
