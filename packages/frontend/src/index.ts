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

interface AppOptions {
  component: any;
  i18n?: any;
  menuSchema?: any;
  routerExtension?: RouterExtension;
  storeExtension?: StoreExtension;
}

export const useApp = (config: AppOptions): Promise<any> => new Promise((resolve) => {

  const {
    component,
    i18n,
    menuSchema,
    routerExtension,
    storeExtension

  }: AppOptions = config;

  const store = createStore()
  const router = createRouter(store)

  if( routerExtension ) {
    extendRouter(router, routerExtension)
  }

  if( storeExtension ) {
    extendStore(store, storeExtension)
  }

  const app = createApp(component)

  app.use(router as any)
  app.use(store as any)
  app.use(useI18n(i18n))

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
  })

  // initializes storage singleton
  const persistentStorage = new PersistentStorage()
  PersistentStorage.instance.switchObjectStore('application')

  store.dispatch('meta/describeAll').then(() => {
    window.dispatchEvent(new CustomEvent('__storeCreated'))
    resolve({
      app,
      router,
      store
    })
  })

})
