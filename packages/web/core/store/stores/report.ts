import { defineStore } from 'pinia'
import useCollection from '../collection'

const collection = useCollection({
  state: {
    limit: 150
  },
  actions: {
    download(payload: any) {
      window.open(payload.filters.file)
    }
  }
})

export default defineStore('report', collection)
