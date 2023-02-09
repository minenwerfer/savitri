declare namespace global {
  var INSTANCE_VARS: {
    themes?: Array<string>
    darkThemes?: Array<string>
    dashboardLayout?: Record<string, {
      noTopbar?: boolean
    }>
  }
}

declare module 'vue-unicons/dist/icons' {
}

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
