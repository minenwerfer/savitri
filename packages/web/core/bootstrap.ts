import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from './state/use'
import type { CollectionDescription } from '../../types'

export const bootstrapRoutes = () => {
  const metaStore = useStore('meta')
  const userStore = useStore('user')
  const router = useRouter()

  watch(() => metaStore.descriptions, (descriptions: Record<string, CollectionDescription>) => {
    Object.values(descriptions).forEach((description) => {
      const routeVisibility = description.route
      if(
        Array.isArray(routeVisibility)
          && !userStore.$currentUser.roles?.some((role: string) => routeVisibility.includes(role))
      ) {
        return
      }

      const routeName = `dashboard-${description.$id}`
      if( router.hasRoute(routeName) ) {
        return
      }

      const route = {
        name: routeName,
        path: description.$id,
        redirect: `/dashboard/c/${description.$id}`,
        meta: {
          title: description.$id,
          icon: description.icon,
        }
      }

      router.addRoute('dashboard', route)
    })

  }, { immediate: true })
}
