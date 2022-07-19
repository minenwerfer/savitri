import { defineStore } from 'pinia'
import type { Router } from 'vue-router'
import type { CollectionState, CollectionActions } from '../../../common/types'
import useCollection from './_collection'

declare namespace window {
  var _router: Router
}

const {
  state,
  actions
} = useCollection()

export default defineStore('accessProfile', {
  state,
  actions: {
    ...actions,
    spawnAdd<T=any>(this: CollectionState<T> & CollectionActions) {
      this.clearItem()
      window._router.push({ name: 'dashboard-access-edit' })
    },
    spawnEdit<T=any>(this: CollectionState<T> & CollectionActions) {
      this.setItem<any>({ banana: 123 })
      window._router.push({ name: 'dashboard-access-edit' })
    }
  }
})
