import 'common/polyfill'

import { createApp } from 'vue'
import { extendRouter, RouterExtension } from './router'
import { extendStore, StoreExtension } from './store'
import { useI18n } from './i18n'
import { instance as createStore } from './store'
import { instance as createRouter } from './router'
import { PersistentStorage } from './idb/singleton'
import { default as webpackVariables } from 'variables'

import 'frontend/../assets/tailwind.css'
import 'frontend/../assets/main.css'

export * from 'vue'

import Unicon from 'vue-unicons'
import * as Icons from 'vue-unicons/dist/icons'

interface Plugin {
  routerExtension?: RouterExtension
  storeExtension?: StoreExtension
}

interface AppOptions {
  component: any
  i18n?: any
  menuSchema?: any
  routerExtension?: RouterExtension
  storeExtension?: StoreExtension
  modules?: Plugin[]
}

export const useApp = (config: AppOptions): Promise<any> => new Promise((resolve) => {

  const {
    component,
    i18n,
    menuSchema,
    routerExtension,
    storeExtension,

  }: AppOptions = config

  const store = createStore()
  const router = createRouter(store)
  const _i18n = useI18n(i18n)

  if( routerExtension ) {
    extendRouter(router, routerExtension)
  }

  if( storeExtension ) {
    extendStore(store, storeExtension)
  }

  if( config.modules ) {
    config.modules.forEach((plugin: Plugin) => {
      if( plugin.routerExtension ) {
        extendRouter(router, plugin.routerExtension)
      }

      if( plugin.storeExtension ) {
        extendStore(store, plugin.storeExtension)
      }
    })
  }

  const app = createApp(component)

  app.use(router as any)
  app.use(store as any)
  app.use(_i18n)

  app.provide('menuSchema', menuSchema)
  app.provide('i18n', i18n)

  app.provide('baseVersion', require('../../../package.json').version)
  // app.provide('productVersion', require(`./package.json`).version)

  Unicon.add([ ...Object.values(Icons) ] as string[])
  app.use(Unicon as any)

  app.mixin({
    provide: {
      ...webpackVariables
    }
  })

  Object.assign(window, {
    _router: router,
    _store: store,
    _i18n
  })

  // initializes storage singleton
  const persistentStorage = new PersistentStorage()
  PersistentStorage.instance.switchObjectStore('application')

  // precaches assets
  if( (webpackVariables as any).productLogo ) {
    const productLogo = new Image()
    productLogo.src = require(`@/../assets/${(webpackVariables as any).productLogo}`).default
  }

  store.dispatch('meta/describeAll').then(() => {
    window.dispatchEvent(new CustomEvent('__storeCreated'))
  })

  resolve({
    app,
    router,
    store
  })

})
