export * from './src'
export * from './src/bootstrap'
export * from './src/composables'
export * from './src/router'
export * from './src/state/use'
export * from './src/state/helpers'
export * from './src/state/collection'
export * from './src/types'

import metaStore from './src/stores/meta'
import userStore from './src/stores/user'

window.STORES.meta = metaStore
window.STORES.user = userStore

export { default as useHttp } from './src/http'
