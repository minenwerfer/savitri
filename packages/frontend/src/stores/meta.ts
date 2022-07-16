import { defineStore } from 'pinia'
import { proxiedHttp as http } from './_http'

export const useMetaStore = defineStore('meta', {
  state: () => ({
    descriptions: [],
    isLoading: false
  }),

  actions: {
    async describeAll() {
      const response = await http.get('meta')
      this.descriptions = response.data?.result
    }
  }
})
