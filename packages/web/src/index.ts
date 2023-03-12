import '@semantic-api/common/polyfill'

import { createApp, App } from 'vue'
import type { Router } from 'vue-router'

import { createPinia } from 'pinia'
import { arraysIntersects } from '@semantic-api/common'
import { createI18n } from 'vue-i18n'
import { routerInstance as createRouter, extendRouter } from './router'

import type { Module, AppOptions } from './types'
import { useStore, useParentStore } from './state/use'
import registerDirectives from './directives'


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

  const metaStore = useStore('meta')
  const userStore = useStore('user')

  if( routerExtension ) {
    extendRouter(router, routerExtension)
  }

  if( config.modules ) {
    config.modules.forEach((module: Module) => {
      module({
        app,
        router,
        extendRouter
      })
    })
  }

  app.use(router)
  app.use(i18n)

  app.provide('menuSchema', menuSchema)
  app.provide('i18n', i18n)

  app.provide('baseVersion', require('../package.json').version)
  app.provide('dashboardLayout', global.INSTANCE_VARS.dashboardLayout || {})

  app.mixin({
    computed: {
      instanceVars: () => global.INSTANCE_VARS,
      currentUser: () => userStore.$currentUser,
      viewTitle: () => {
        const currentRoute = router.currentRoute.value
        const title = currentRoute.meta?.title as string

        if( !title ) {
          return
        }

        return title.replace(
          '%viewTitle%',
          I18N.global.tc(currentRoute.params?.collection || '', 2).capitalize()
        )
      },
      viewIcon: () => {
        const currentRoute = router.currentRoute.value
        return currentRoute.meta.icon
          || metaStore.descriptions[currentRoute.params?.collection as string]?.icon
      }
    },
    methods: {
      getLayoutOption(optionName: keyof typeof global.INSTANCE_VARS['dashboardLayout']) {
        const dashboardLayout = global.INSTANCE_VARS.dashboardLayout

        if( !dashboardLayout ) {
          return null
        }

        const role = userStore.$currentUser.roles?.find((role: string) => role in dashboardLayout) || 'default'

        return dashboardLayout[role]?.[optionName]
      },
      hasRoles(roles: string|Array<string>) {
        return arraysIntersects(roles, userStore.$currentUser.roles)
      },
      useStore(storeName: string) {
        return useParentStore(storeName)
      }
    }
  })

  Object.assign(window, {
    ROUTER: router,
    QUERY_CACHE: {},
    I18N: i18n
  })

  await metaStore.describeAll()

  resolve({
    app,
    router,
    mount: () => app.mount('#app')
  })
})
