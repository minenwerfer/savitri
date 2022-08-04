import * as R from 'ramda'
import { PAGINATION_PER_PAGE_DEFAULT } from '../../../common'
import type { CollectionState } from '../../types/store'
import actions from './actions'
import getters from './getters'

type StoreOptions =
  'state'
  | 'actions'
  | 'getters'

export default (
  newer?: {
    [P in StoreOptions]?: Record<string, any>
  }
) => {
  const initial = {
    state,
    actions,
    getters
  }

  const merge = () =>
    R.mergeDeepWith(
      (a: any, b: any) => R.is(Object, a) && R.is(Object, b) && typeof a !== 'function'
        ? R.concat(a, b)
        : b,
      initial,
      newer
  )

  return newer
    ? merge()
    : initial
}

const state = <T=object>(): CollectionState<T> => {
  return {
    item: {},
    freshItem: {},
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
      limit: PAGINATION_PER_PAGE_DEFAULT,
      recordsCount: 0,
      recordsTotal: 0,
      currentPage: 0
    }
  }
}

