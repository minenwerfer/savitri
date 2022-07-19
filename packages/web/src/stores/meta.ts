import { defineStore } from 'pinia'
import { CollectionDescription } from '../../../common/types'
import useHttp from './_http'
import useCollection from './_collection'

const stores = require('./')

type CollectionName = string

const { http } = useHttp()

export default defineStore('meta', {
  state: () => ({
    descriptions: [],
    isLoading: false
  }),

  actions: {
    async describeAll() {
      const response = await http.get('meta')
      const descriptions: Record<CollectionName, CollectionDescription> =
        this.descriptions = response.data?.result

      // monkeypatchs '@savitri/web/stores' object
      Object.entries(descriptions).forEach(([collectionName, description]) => {
        if( collectionName in stores ) {
          const store = stores[collectionName]()
          store.description = description
          return
        }

        const {
          state,
          actions: collectionActions
        } = useCollection()

        stores[collectionName] = defineStore(collectionName, {
          state: () => Object.assign(state(), {
            description
          }),

          actions: {
            ...collectionActions,
          }
        })
      })
    }
  }
})
