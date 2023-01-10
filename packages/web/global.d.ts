declare namespace global {
  var INSTANCE_VARS: {
    themes?: Array<string>
  }
}

declare module 'vue-unicons/dist/icons' {
}

declare module '@savitri/ui' {
  export { default as routes } from '../ui/router'
}

declare var ROUTER: any
declare var I18N: any
declare var STORES: Record<string, any>
declare var QUERY_CACHE: Record<string, {
  items: Array<any>
  satisfied: boolean
}>
