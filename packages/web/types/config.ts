import type { App } from 'vue'
import type { Router, RouteRecordRaw } from 'vue-router'
import type { extendRouter, RouterExtension } from '../core/router'

export type Plugin = (config: {
  app: App
  router: Router
  extendRouter: typeof extendRouter
}) => void

export type MenuSchema = Record<string, {
  roles?: Array<string>
  children: Array<string>
  shrink?: boolean
}>

export type AppOptions = {
  component: any
  i18n?: any
  menuSchema?: MenuSchema
  routerExtension?: RouterExtension
  modules?: Array<Plugin>
  routes?: Array<RouteRecordRaw>
}
