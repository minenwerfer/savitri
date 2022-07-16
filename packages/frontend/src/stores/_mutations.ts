import type { CollectionState } from '../../../common/types'

export const mutations = {
  ITEM_GET: <T>(
    state: Pick<CollectionState<T>, 'item'>,
    item: T
  ) => {
    state.item = item
  },

  ITEMS_GET: <T>(
    state: Pick<CollectionState<T>, 'items'>,
    items: Array<T>
  ) => {
    state.items = items
  },

  ITEM_CLEAR: <T=any>(state: Pick<CollectionState<T>, 'item'>) => {
    state.item = {}
  },

  ITEMS_CLEAR: <T=any>(state: Pick<CollectionState<T>, 'items'>) => {
    state.items = []
  }
}
