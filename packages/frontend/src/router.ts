import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

/**
 * @exports
 * Just a bare template for nested children.
 */
export const BareTemplate = {
  template: `<router-view />`
}

export interface RouteMeta {
  meta?: {
    title: string
    hidden?: boolean
    isPrivate?: boolean
    order?: number
  }
}

export type RouterExtension = { [key: string]: Route[] };

export type Route = RouteMeta & RouteRecordRaw & {
  children?: Route[];
  components?: any;
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
export const makeRoutes = (publicRoutes: Route[], privateRoutes: Route[]) => {
  return [
    ...publicRoutes.map((route: Route) => labelRoute(route, { isPrivate: false })),
    ...privateRoutes.map((route: Route) => labelRoute(route, { isPrivate: true })),
  ]
}

/**
 * @exports
 * The router instance.
 */
export const instance = (routes: Route[], store: any) => {
  const router = createRouter({
    history: createWebHistory(),
    routes
  })

  // eslint-disable-next-line
  router.beforeEach(async (to, from, next: (props?: any) => void) => {
    /**
     * @remarks
     * Will wait for module registration if necessary.
     */
    if( !(store.state.meta?.globalDescriptions?.length > 0) ) {
      await new Promise((resolve) => {
        /**
         * @event __storeCreated
         * Will fire as soon as modules are dinamically registered.
         */
        window.removeEventListener('__storeCreated', resolve)
        window.addEventListener('__storeCreated', resolve)
      })
    }

    store.dispatch('meta/setViewTitle', to.meta.title)
    if( process.env.NODE_ENV === 'development' ) {
      return next()
    }

    if( to.meta.isPrivate && !store.getters['user/token'] ) {
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
    .forEach(([parentName, routes]: [string, Route[]]) => {
      routes.forEach((route: Route) => router.addRoute(parentName, route))
    })
}
