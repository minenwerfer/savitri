import { inject } from 'vue'

declare global {
  interface Window {
    __stores: Record<string, (() => any) & { $id: string }>
  }
}

const stores: typeof window.__stores = window.__stores = {}
stores.meta = require('./stores/meta').default
stores.user = require('./stores/user').default
stores.accessProfile = require('./stores/accessProfile').default

export const useStore = (storeId: string) => {
  if( !(storeId in window.__stores) ) {
    throw new Error(`tried to invoke non existent store "${storeId}"`)
  }

  return window.__stores[storeId]()
}

export const useParentStore = (fallback?: string) => {
  let parentStoreId = inject<any>('storeId')
  if( !parentStoreId ) {
    if( !fallback ) {
      throw new Error('no parent store found')
    }

    parentStoreId = fallback
  }

  return useStore(parentStoreId.value||parentStoreId)
}

export const hasStore = (storeId: string) => {
  return storeId in stores
}

export const registerStore = async <
  T extends { $id: string },
  F extends (() => T) & T,
  A extends Promise<{ default: F }>
>(fn: F | A): Promise<void> => {
  if( fn instanceof Promise ) {
    return fn.then((store) => {
      registerStore(store.default)
    })
  }

  const store: F = fn as F
  const storeId = store.$id
  stores[storeId] = fn
}

export const getStores = () => {
  return stores
}
