import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useStore } from './store'

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

export type RouterExtension = Record<string, Record<string, Omit<Route, 'name'>>>

export type Route = RouteMeta & Omit<RouteRecordRaw, 'children'> & {
  children?: Record<string, any>
  components?: any
}

/**
 * @exports
 */
export const makeRoutes = (publicRoutes: Array<Route>, privateRoutes: Array<Route>) => {
  return [
    ...publicRoutes,
    ...privateRoutes
  ]
}

/**
 * @exports
 * The router instance.
 */
export const routerInstance = (routes: Array<RouteRecordRaw>) => {
  const router = createRouter({
    history: createWebHistory(),
    routes
  })

  const metaStore = useStore('meta')
  const userStore = useStore('user')

  // eslint-disable-next-line
  router.beforeEach(async (to, _from, next) => {
    metaStore.view.title = to.meta?.title
    if( process.env.NODE_ENV === 'development' ) {
      return next()
    }

    if( to.meta?.isPrivate && !userStore.token ) {
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
  const normalize = (routes: Record<string, Omit<Route, 'name'>>): Array<any> => Object.entries(routes)
    .map(([routeName, route]) => ({
      ...route,
      name: routeName,
      children: route.children && normalize(route.children)
    }))

  Object.entries(routerExtension)
    .forEach(([parentName, routes]) => {
      const normalized = normalize(routes)
      normalized.forEach((route) => router.addRoute(parentName, route))
    })
}
