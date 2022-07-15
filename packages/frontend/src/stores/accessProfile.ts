import { defineStore } from 'pinia'
import type { Router } from 'vue-router'
import { state, actions } from './_collection'
// import { crudActions } from './_crud'

declare namespace window {
  var _router: Router
}

export const useAccessProfileStore = defineStore('accessProfile', {
  state,
  actions: {
    ...actions,
    // ...crudActions(),
    spawnAdd() {
      actions.clearItem.call(this)
      window._router.push({ name: 'dashboard-access-edit' })
    },
    spawnEdit() {
      actions.setItem.call(this, { banana: 123 })
      window._router.push({ name: 'dashboard-access-edit' })
    }
  }
})
