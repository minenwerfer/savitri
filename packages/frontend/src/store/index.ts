import { createStore, createLogger, Store } from 'vuex'
import { autoModules, crud } from './plugins'

import { MetaModule } from './modules/meta'
import { UserModule } from './modules/user'
import { AccessModule } from './modules/access'

export const instance = (): Store<any> => {
  return createStore<any>({
    modules: {
      meta: (new MetaModule() as any).module,
      user: (new UserModule() as any).module,
      access: (new AccessModule() as any).module
    },
    plugins: [
      autoModules,
      crud,
      ...(process.env.NODE_ENV === 'development' ? [createLogger()] : [])
    ],
    strict: process.env.NODE_ENV === 'production'
  })
}

export type StoreExtension = any;

export const extendStore = (store: Store<any>, storeExtension: StoreExtension) => {
  Object.entries(storeExtension)
    .forEach(([name, module]: [string, any]) => store.registerModule(name, module))
}
