/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'variables' {
  const strict: true
  const productName: string
  const bundleName: string
}

declare module 'vue-unicons/dist/icons' {
  const uniCarWash: any
  const uniLayerGroupMonochrome: any
}
