import type { App } from 'vue'
import type { Router } from 'vue-router'

export type Module = (config: {
  app: App
  router: Router
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
  modules?: Array<Module>
}
