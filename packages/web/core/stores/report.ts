import { defineStore } from 'pinia'
import useCollection from '../state/collection'
import { SV_API_URL } from '../../../types/constants'

const collection = useCollection({
  state: {
    limit: 150
  },
  actions: {
    download(payload: any) {
      const item = payload || this.item
      window.open(`${SV_API_URL}/file/${item.file?._id}/download`)
    }
  }
})

export default defineStore('report', collection)
