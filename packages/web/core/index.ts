import '../../common/polyfill'

import { createApp } from 'vue'
import Unicon from 'vue-unicons'
import * as Icons from 'vue-unicons/dist/icons'
import type { Router } from 'vue-router'
export * from 'vue'

import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import { routes } from '@savitri/components'
import { extendRouter, RouterExtension } from './router'
import { routerInstance as createRouter } from './router'
import { default as webpackVariables } from 'variables'

import { useStore } from './store'

type Plugin = {
  routerExtension?: RouterExtension
}

interface AppOptions {
  component: any
  i18n?: any
  menuSchema: any
  routerExtension?: RouterExtension
  modules?: Array<Plugin>
}

export const useApp = (config: AppOptions): Promise<{
  app: any
  router: Router
}> => new Promise(async (resolve) => {
  const {
    component,
    i18n,
    menuSchema,
    routerExtension,

  }: AppOptions = config

  const app = createApp(component)
  app.use(createPinia())

  const router = createRouter(routes)
  const _i18n = createI18n(i18n)

  if( routerExtension ) {
    extendRouter(router, routerExtension)
  }

  // if( storeExtension ) {
  //   extendStore(store, storeExtension)
  // }

  if( config.modules ) {
    config.modules.forEach((plugin: Plugin) => {
      if( plugin.routerExtension ) {
        extendRouter(router, plugin.routerExtension)
      }

      // if( plugin.storeExtension ) {
      //   extendStore(store, plugin.storeExtension)
      // }
    })
  }

  app.use(router)
  app.use(_i18n)

  app.provide('menuSchema', menuSchema)
  app.provide('i18n', i18n)

  app.provide('baseVersion', require('../package.json').version)
  // app.provide('productVersion', require(`./package.json`).version)

  Unicon.add([ ...Object.values(Icons) ] as Array<string>)
  app.use(Unicon as any)

  app.mixin({
    provide: {
      ...webpackVariables
    }
  })

  Object.assign(window, {
    _router: router,
    // _store: store,
    _i18n
  })

  // initializes storage singleton
  // const persistentStorage = new PersistentStorage()
  // PersistentStorage.instance.switchObjectStore('application')
  //
  const metaStore = useStore('meta')
  await metaStore.describeAll()

  // store.dispatch('meta/describeAll').then(() => {
  //   window.dispatchEvent(new CustomEvent('__storeCreated'))
  // })

  resolve({
    app,
    router,
    // store
  })
})
