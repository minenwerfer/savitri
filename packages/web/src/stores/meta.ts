import { defineStore } from 'pinia'
import { CollectionDescription } from '../../../common/types'
import useHttp from './_http'
import useUtil from './_util'
import useCollection from './_collection'

import { stores, hasStore, registerStore } from './'

type CollectionName = string

const { http } = useHttp()
const { parseQuery } = useUtil()

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
      for ( const [collectionName, description] of Object.entries(descriptions) ) {
        console.log(collectionName)

        const rawDescription = Object.assign({}, description)
        description.fields = await parseQuery(description.fields, false)

        if( hasStore(collectionName) ) {
          const store = stores[collectionName]()
          store.$patch({
            description,
            rawDescription
          })
          continue
        }

        const {
          state,
          actions,
          getters
        } = useCollection()

        const store = defineStore(collectionName, {
          state: () => Object.assign(state(), {
            description,
            rawDescription
          }),

          actions,
          getters
        })

        registerStore(store)
      }
    }
  }
})
