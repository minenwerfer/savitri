/// <reference types="vue/macros-global" />

/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'variables' {
  const strict: true
  const bundleName: string
  const workingDir: string
  const productName: string
  const productLogo: string
}

declare module 'vue-unicons/dist/icons' {
}
