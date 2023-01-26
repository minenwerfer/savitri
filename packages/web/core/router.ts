import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useStore } from './state'

export type RouteMeta = {
  meta?: {
    title: string
    hidden?: boolean
    isPrivate?: boolean
    order?: number
    roles?: Array<string>
  }
}


export type Route = RouteMeta & Omit<RouteRecordRaw, 'children'> & {
  path: string
  children?: Array<Route>
  components?: any
}

export type RouterExtensionNode = Array<Omit<Route, 'name'>>
export type RouterExtension = Record<string, RouterExtensionNode>

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

export const normalizeRoutes = (node: RouterExtensionNode, parentName?: string) => {
  return node.map((child) => {
    if( child.children ) {
      child.children = normalizeRoutes(child.children, parentName)
    }

    const normalizedName = child.path
      .replace(/^\//, '')
      .replace(/\/:?/, '-')

    return {
      name: `${parentName}-${normalizedName}`,
      ...child
    }
  })
}

export const extendRouter = (router: any, routerExtension: RouterExtension) => {
  Object.entries(routerExtension).forEach(([key, routes]) => {
    const parentName = key === 'public'
      ? ''
      : key

    const normalized = normalizeRoutes(routes, key)
    normalized.forEach((route) => router.addRoute(parentName, route))
  })
}
