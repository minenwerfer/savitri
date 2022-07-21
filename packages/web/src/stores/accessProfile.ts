import { defineStore } from 'pinia'
import type { Router } from 'vue-router'
import type { CollectionState, CollectionStoreActions } from '../../types/store'
import useCollection from './_collection'

declare namespace window {
  var _router: Router
}

const {
  state,
  actions,
  getters
} = useCollection()

export default defineStore('accessProfile', {
  state,
  actions: {
    ...actions,
    spawnAdd<T=any>(this: CollectionState<T> & CollectionStoreActions) {
      this.clearItem()
      window._router.push({ name: 'dashboard-access-edit' })
    },
    spawnEdit<T=any>(this: CollectionState<T> & CollectionStoreActions) {
      window._router.push({ name: 'dashboard-access-edit' })
    }
  },
  getters
})
