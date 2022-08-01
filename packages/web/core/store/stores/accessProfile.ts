import { defineStore } from 'pinia'
import useCollection from '../collection'

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
      ROUTER.push({ name: 'dashboard-access-edit' })
    },
    spawnEdit() {
      ROUTER.push({ name: 'dashboard-access-edit' })
    }
  },
  getters
})
