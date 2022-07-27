import { defineStore } from 'pinia'
import type { Router } from 'vue-router'
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
    spawnAdd() {
      this.clearItem()
      window._router.push({ name: 'dashboard-access-edit' })
    },
    spawnEdit() {
      window._router.push({ name: 'dashboard-access-edit' })
    }
  },
  getters
})
