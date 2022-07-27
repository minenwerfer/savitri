import { inject } from 'vue'

declare global {
  interface Window {
    stores: any
  }
}

const stores: Record<string, any> = {}

export {
  useStore,
  useParentStore,
  hasStore,
  registerStore,
  getStores
}

stores.accessProfile = require('./accessProfile').default
stores.meta = require('./meta').default
stores.user = require('./user').default

Object.assign(window, {
  stores
})

const useStore = (storeId: string) => {
  if( !(storeId in window.stores) ) {
    throw new Error(`tried to invoke non existent store "${storeId}"`)
  }

  return window.stores[storeId]()
}

const useParentStore = (fallback?: string) => {
  let parentStoreId = inject<any>('storeId')
  if( !parentStoreId ) {
    if( !fallback ) {
      throw new Error('no parent store found')
    }

    parentStoreId = fallback
  }

  return useStore(parentStoreId.value||parentStoreId)
}

const hasStore = (storeId: string) => {
  return storeId in stores
}

const registerStore = (store: any) => {
  const storeId = store.$id
  stores[storeId] = store
}

const getStores = () => {
  return window.stores
}
