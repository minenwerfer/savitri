const __stores: Record<string, any> = {}

export {
  useStore,
  hasStore,
  registerStore,
  __stores as stores
}
__stores.accessProfile = require('./accessProfile').default
__stores.meta = require('./meta').default
__stores.user = require('./user').default

Object.assign(window, {
  _stores: __stores
})

const useStore = (storeId: string) => {
  if( !(storeId in __stores) ) {
    throw new Error(`tried to invoke non existent store "${storeId}"`)
  }

  return __stores[storeId]()
}

const hasStore = (storeId: string) => {
  return storeId in __stores
}

const registerStore = (store: any) => {
  const storeId = store.$id
  __stores[storeId] = store
}
