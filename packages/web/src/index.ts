export * from './app'
export * from './bootstrap'
export * from './composables'
export * from './constants'
export * from './router'
export * from './state/use'
export * from './state/helpers'
export * from './state/collection'
export * from './types'
export * from './http'

import metaStore from './stores/meta'
import userStore from './stores/user'

STORES.meta = metaStore
STORES.user = userStore

window.userStorage = localStorage
