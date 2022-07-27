import type { CollectionState } from '../../types/store'
import actions from './_actions'
import getters from './_getters'

export default () => {
  return {
    state,
    actions,
    getters
  }
}

const state = <T=object>(): CollectionState<T> => {
  return {
    item: {},
    items: [],

    selected: [],

    filters: {},
    queryCache: {},
    description: {},
    rawDescription: {},

    meta: {
      isLoading: false,
      halt: false
    },

    pagination: {
      offset: 0,
      limit: 0,
      recordsCount: 0,
      recordsTotal: 0,
      currentPage: 0
    }
  }
}

