import '../../common/polyfill'

import { createApp } from 'vue'
import VueLazyLoad from 'vue3-lazyload'
import VueUnicon from 'vue-unicons'
import * as Icons from 'vue-unicons/dist/icons'
import type { Router } from 'vue-router'
export * from 'vue'

import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import { routes } from '@savitri/ui'
import { extendRouter, RouterExtension } from './router'
import { routerInstance as createRouter } from './router'
import { default as webpackVariables } from 'variables'

import { useStore } from './state'
import registerDirectives from '../../ui/directives'

type Plugin = {
  routerExtension?: RouterExtension
}

type MenuSchema = Record<string, {
  roles?: Array<string>
  children: Array<string>
  shrink?: boolean
}>

interface AppOptions {
  component: any
  i18n?: any
  menuSchema: MenuSchema
  routerExtension?: RouterExtension
  modules?: Array<Plugin>
}

export const useApp = (config: AppOptions): Promise<{
  app: any
  router: Router
}> => new Promise(async (resolve) => {
  const {
    component,
    i18n: i18nConfig,
    menuSchema,
    routerExtension,

  }: AppOptions = config

  const app = createApp(component)
  app.use(createPinia())
  registerDirectives(app)

  const router = createRouter(routes)
  const i18n = createI18n(i18nConfig)

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
  app.use(i18n)

  app.provide('menuSchema', menuSchema)
  app.provide('i18n', i18n)

  app.provide('baseVersion', require('../package.json').version)
  // app.provide('productVersion', require(`./package.json`).version)

  VueUnicon.add([ ...Object.values(Icons) ] as Array<string>)
  app.use(VueUnicon as any)
  app.use(VueLazyLoad)

  app.mixin({
    provide: {
      ...webpackVariables
    }
  })

  Object.assign(window, {
    ROUTER: router,
    QUERY_CACHE: {},
    // _store: store,
    I18N: i18n
  })

  const metaStore = useStore('meta')
  await metaStore.describeAll()

  resolve({
    app,
    router,
  })
})
