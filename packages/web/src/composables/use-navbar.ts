import { ref, computed, watch, } from 'vue'
import { arraysIntersects } from '@semantic-api/common'
import { useStore, useRouter, Route, MenuSchema } from '..'

type Props = {
  entrypoint?: string
  schema: MenuSchema
}

export const useNavbar = async (props: Props) => {
  const {
    entrypoint = 'dashboard',
    schema: menuSchema
  } = props

  const metaStore = useStore('meta')
  const userStore = useStore('user')
  const router = await useRouter()

  const getSchema = (schema: MenuSchema | MenuSchema[string], routes: Array<Route>) => {
    if( !Array.isArray(schema) ) {
      return schema
    }

    return schema.map((s) => {
      return typeof s === 'string'
        ? routes.find((route) => route.name === s)
        : {
          ...s,
          ...routes.find((route) => route.name === s.name)
        }
    })
  }

  const getRoutes = async (node?: MenuSchema): Promise<Array<Route>> => {
    const children = node?.children
    const routes: unknown = children || typeof entrypoint === 'string'
      ? router.getRoutes().filter((route: Route) => (route.name as string ||'').startsWith(`/${entrypoint}/`))
      : router.getRoutes() 

    const schema = getSchema(children || menuSchema, routes as Array<Route>)
    const entries: Record<string, Route> = {}

    await Promise.all(Object.entries(schema).map(async ([key, node]) => {
      if( !node ) {
        return
      }

      const {
        children,
        ...route

      } = node

      const roles = route?.meta?.roles || node.roles
      if( roles ) {
        if( typeof roles === 'function' ) {
          if( !await roles(userStore.$currentUser.roles) ) {
            return
          }

        }
        else if( !arraysIntersects(userStore.$currentUser.roles, roles) ) {
          return
        }
      }

      entries[key] = route
      entries[key].meta = route.meta || {
        title: key
      }

      if( children ) {
        entries[key].children = await getRoutes(node)
      }
    }))

    return Object.values(entries) as Array<Route>
  }

  const isCurrent = (subroute: any) => {
    const route = router.currentRoute.value

    const pathMatches = typeof subroute.redirect === 'string'
      ? subroute.redirect === route.path
      : subroute.path === (route.redirectedFrom?.path || route.path)?.split(/\/home$/)[0]

    const nameMatches = subroute.name === (route.redirectedFrom?.name || route.name)
    return pathMatches || nameMatches
  }

  const routes = ref<Array<Route>>(await getRoutes())
  const routesWithChildren = computed(() => (
    routes.value.filter((route) => route.children?.length! > 0)
  ))

  watch(() => metaStore.descriptions, async () => {
    routes.value = await getRoutes()
  })

  return {
    routes,
    routesWithChildren,
    isCurrent
  }
}
