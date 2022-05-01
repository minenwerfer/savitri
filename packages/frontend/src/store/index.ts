import { createStore, createLogger, Store } from 'vuex'
import { autoModules, crud } from './plugins'

export * from './module'

import { MetaModule } from './modules/meta'
import { UserModule } from './modules/user'
import { AccessProfileModule } from './modules/accessProfile'
import { NotificationModule } from './modules/notification'
import { ReportModule } from './modules/report'
import { ReleaseModule } from './modules/release'

export const instance = (): Store<any> => {
  const store = createStore<any>({
    modules: {
      meta: (new MetaModule() as any).module,
      user: (new UserModule() as any).module,
      accessProfile: (new AccessProfileModule() as any).module,
      notification: (new NotificationModule()  as any).module,
      report: (new ReportModule()  as any).module,
      release: (new ReleaseModule()  as any).module
    },
    plugins: [
      autoModules,
      crud,
      ...(process.env.NODE_ENV === 'development' ? [createLogger()] : [])
    ],
    strict: process.env.NODE_ENV === 'production'
  })

  const evtListener = window.addEventListener('__updateQueryCache', ({ detail }: any) => {
    store.commit(`${detail.parentModule}/CACHE_QUERY`, {
      module: detail.module,
      result: detail.result
    })
  })

  return store
}

export type StoreExtension = any;

export const extendStore = (store: Store<any>, storeExtension: StoreExtension) => {
  Object.entries(storeExtension)
    .forEach(([name, module]: [string, any]) => store.registerModule(name, module))
}
