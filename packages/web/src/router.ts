import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useStore } from './stores'

/**
 * @exports
 * Just a bare template for nested children.
 */
export const BareTemplate = {
  template: `<router-view />`
}

export type RouteMeta = {
  meta?: {
    title: string
    hidden?: boolean
    isPrivate?: boolean
    order?: number
  }
}

export type RouterExtension = Record<string, Array<Route>>

export type Route = RouteMeta & RouteRecordRaw & {
  children?: Array<Route>
  components?: any
}

/**
 * @function
 * Recursively labels routes.
 */
const labelRoute = (target: Route, meta: any): Route => {
  const route = Object.assign({}, target)
  Object.assign(route, meta)

  if( route.children && Array.isArray(route.children) ) {
    route.children = route.children.map((child: Route) => labelRoute(child, meta))
  }

  return route
}

/**
 * @exports
 */
export const makeRoutes = (publicRoutes: Array<Route>, privateRoutes: Array<Route>) => {
  return [
    ...publicRoutes.map((route: Route) => labelRoute(route, { isPrivate: false })),
    ...privateRoutes.map((route: Route) => labelRoute(route, { isPrivate: true })),
  ]
}

/**
 * @exports
 * The router instance.
 */
export const routerInstance = (routes: Array<Route>) => {
  const router = createRouter({
    history: createWebHistory(),
    routes
  })

  const metaStore = useStore('meta')
  const userStore = useStore('user')

  // eslint-disable-next-line
  router.beforeEach(async (to:Route, from:Route, next: (props?: any) => void) => {
    // if( !(store.state.meta.globalDescriptions?.length > 0) ) {
    //   await new Promise((resolve) => {
    //     /**
    //      * @event __storeCreated
    //      * Will fire as soon as collections are dinamically registered.
    //      */
    //     window.removeEventListener('__storeCreated', resolve)
    //     window.addEventListener('__storeCreated', resolve)
    //   })
    // }

    metaStore.view.title = to.meta.title
    if( process.env.NODE_ENV === 'development' ) {
      return next()
    }

    if( to.meta.isPrivate && !userStore.token ) {
      next({ name: 'signin' })
    }

    else next()
  })


  router.afterEach(() => {
    window.scrollTo(0, 0)
  })

  return router
}

export const extendRouter = (router: any, routerExtension: RouterExtension) => {
  Object.entries(routerExtension)
    .forEach(([parentName, routes]: [string, Array<Route>]) => {
      routes.forEach((route: Route) => router.addRoute(parentName, route))
    })
}
