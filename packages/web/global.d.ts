declare module '@savitri/ui' {
  export { default as routes } from '../ui/router'
}

var ROUTER: any
var I18N: any
var STORES: Record<string, any>
var QUERY_CACHE: Record<string, {
  items: Array<any>
  satisfied: boolean
}>

var INSTANCE_VARS: {
  themes?: Array<string>
  darkThemes?: Array<string>
  dashboardLayout?: Record<string, {
  }>
}
