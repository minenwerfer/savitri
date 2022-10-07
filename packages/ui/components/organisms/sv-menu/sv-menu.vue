<template>
  <div :class="`menu ${!visible && 'menu--hidden'}`">
    <sv-menu-header></sv-menu-header>

    <!-- menu entries -->
    <div class="menu__entries">
      <div
        v-for="(route, index) in routesWithChildren"
        :key="`route-${index}`"
        class="menu__entry"
      >
        <a
          class="menu__entry-name"
          @click="onEntryClick(route)"
        >
          {{ $tc(route.meta.title, 2).capitalize() }}
        </a>

        <!-- subroutes -->
        <div>
          <sv-icon
            v-clickable
            v-for="(subroute, index) in route.children"
            :key="`subroute-${index}`"
            :class="`
              menu__subroute
              ${isCurrent(subroute) && 'menu__subroute--current'}
            `"

            :name="subroute.meta?.unicon || 'file'"
            @click="onEntryClick(subroute)"
          >
            {{ $tc(subroute.meta.title, 2).capitalize() }}
          </sv-icon>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { SvIcon } from '../../'

import { useStore } from '@savitri/web'
import { Route } from '@savitri/web/router'

import SvMenuHeader from './_internals/components/sv-menu-header/sv-menu-header.vue'

type Props = {
  entrypoint?: string
  visible: boolean
  schema?: any
}

type SchemaNode = {
  roles: Array<string>
  children?: Route
}

const props = defineProps<Props>()

const metaStore = useStore('meta')
const userStore = useStore('user')
const router = useRouter()

const tick = ref(0)
const productName = inject('productName')
const productLogo = inject('productLogo', undefined)

const onEntryClick = (route: Route & { meta: any }) => {
  if( route.name ) {
    router.push({ name: route.name })
  }
  if( route.meta?.action ) {
    route.meta.action()
  }
}

const getSchema = (schema: any, routes: Array<Route>) => {
  if( !Array.isArray(schema) ) {
    return schema
  }

  return schema.map((s) => {
    return typeof s === 'string'
      ? routes.find((route: Route) => route.name === s)
      : s
  })
}

const getRoutes = ({ children }: SchemaNode = {}): Array<Route> => {
  const routes = children || typeof props.entrypoint === 'string'
    ? router.getRoutes().filter((route) => (route.name ||'').startsWith(`${props.entrypoint}-`))
    : router.getRoutes()

  const schema = getSchema(children || props.schema, routes as Array<Route>)
  const entries: Record<string, Route> = {}

  Object.entries(schema)
    .forEach(([key, node]) => {
      if( !node ) {
        return
      }

      const {
        children,
        ...route

      } = node

      const roles = route?.meta?.roles || node.roles
      if( roles && !roles.includes(userStore.$currentUser.role) ) {
        return
      }

      entries[key] = route
      entries[key].meta = route.meta || {
        title: key
      }

      if( children ) {
        entries[key].children = getRoutes(node)
      }
    })

  return Object.values(entries) as Array<Route>
}

const isCurrent = (subroute: any) => {
  const route = useRoute()
  return (subroute.redirect || subroute.path) === route.path
}

const routes = ref<Array<Route>>(getRoutes())
const routesWithChildren = computed(() => (
  routes.value.filter((route) => route.children?.length > 0)
))

watch(() => metaStore.descriptions, () => {
  routes.value = getRoutes()
})
</script>

<style scoped src="./sv-menu.scss"></style>
