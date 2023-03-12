import type { App } from 'vue'
import type { Router, RouteRecordRaw } from 'vue-router'
import type { extendRouter, RouterExtension } from '../router'

export type Module = (config: {
  app: App
  router: Router
  extendRouter: typeof extendRouter
}) => void;

export type MenuAdvancedChildren = {
  name: string
  badgeFunction?: string
  badgePayload?: any
}

export type MenuSchema = Record<string, {
  roles?: Array<string>
  children: Array<string|MenuAdvancedChildren>
}>

export type AppOptions = {
  component: any
  i18n?: any
  menuSchema?: MenuSchema
  routerExtension?: RouterExtension
  modules?: Array<Module>
  routes?: Array<RouteRecordRaw>
}
