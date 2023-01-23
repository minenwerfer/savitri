import '@semantic-api/common/polyfill'

import { createApp, App } from 'vue'
import VueLazyLoad from 'vue3-lazyload'
import VueUnicon from 'vue-unicons'
import * as Icons from 'vue-unicons/dist/icons'
import type { Router } from 'vue-router'

import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import { routerInstance as createRouter, extendRouter } from './router'
// import { default as webpackVariables } from 'variables'

import type { Plugin, AppOptions } from '../types'
import registerDirectives from './directives'
import { useStore } from './state'


export const useApp = (config: AppOptions): Promise<{
  app: App
  router: Router
  mount: () => any
}> => new Promise(async (resolve) => {
  const {
    component,
    i18n: i18nConfig,
    menuSchema,
    routerExtension,

  }: AppOptions = config

  const app = createApp(component)
  registerDirectives(app)

  const pinia = createPinia()
  app.use(pinia)

  const router = createRouter(config.routes||[])
  const i18n = createI18n(i18nConfig)

  pinia.use(() => ({
    router,
    i18n: i18n.global,
    store: useStore
  }))


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
  app.provide('dashboardLayout', global.INSTANCE_VARS.dashboardLayout || {})

  VueUnicon.add([ ...Object.values(Icons) ] as Array<string>)
  app.use(VueUnicon as any)
  app.use(VueLazyLoad)

  app.mixin({
    computed: {
      viewTitle: () => {
        const currentRoute = router.currentRoute.value
        const title = currentRoute.meta?.title

        if( !title ) {
          return
        }

        return title === '%viewTitle%'
          ? I18N.global.tc(currentRoute.params?.collection, 2)
          : title
      }
    },
    methods: {
      getLayoutOption(optionName: keyof typeof global.INSTANCE_VARS['dashboardLayout']) {
        const userStore = useStore('user')
        const dashboardLayout = global.INSTANCE_VARS.dashboardLayout

        if( !dashboardLayout ) {
          return null
        }

        const role = userStore.$currentUser.roles?.find((role: string) => role in dashboardLayout) || 'default'

        return dashboardLayout[role]?.[optionName]
      }
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
    mount: () => app.mount('#app')
  })
})
