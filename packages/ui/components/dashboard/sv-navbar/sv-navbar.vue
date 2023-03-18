<template>
  <div
    :key="mobileVisible"
    v-overlay="{
      condition: mobileVisible,
      click: () => emit('update:mobileVisible', false)
    }"
    :class="`
      navbar
      no-print
      ${!visible && 'navbar--hidden'}
      ${mobileVisible && 'navbar--mobile-visible'}
  `">
    <sv-navbar-header class="navbar__header"></sv-navbar-header>

    <div v-if="$slots['navbar-action']" class="navbar__action">
      <slot name="navbar-action"></slot>
    </div>
    <!-- navbar entries -->
    <div class="navbar__entries">
      <div
        v-for="(entry, index) in routesWithChildren"
        :key="`entry-${index}`"
        class="navbar__entry"
      >
        <!-- subroutes -->
        <sv-icon
          v-clickable
          v-for="route in entry.children"
          :key="route.name"
          :class="`
            navbar__route
            ${isCurrent(route) && 'navbar__route--current'}
          `"

          :name="route.meta?.icon || 'file'"
          :title="$tc(route.meta.title, 2).capitalize()"
          @click="onEntryClick(route)"
        >
          <span>{{ $tc(route.meta.title, 2).capitalize() }}</span>
          <span v-if="route.badgeFunction">
            ({{
              useStore(route.badgeFunction.split('@')[0])
                .customGetter[route.badgeFunction.split('@')[1]]('navbar', route.badgePayload)
            }})
          </span>
        </sv-icon>
      </div>
    </div>

    <div v-if="$slots['navbar-bottom']" class="navbar__bottom">
      <slot name="navbar-bottom"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { arraysIntersects } from '@semantic-api/common'
import { useStore, Route, MenuSchema } from '@savitri/web'
import SvIcon from '../../sv-icon/sv-icon.vue'
import SvNavbarHeader from './_internals/components/sv-navbar-header/sv-navbar-header.vue'

type Props = {
  entrypoint?: string
  visible: boolean
  mobileVisible?: boolean
  schema: MenuSchema
}

type SchemaNode = {
  roles?: Array<string>
  children?: Route
}

type Emit = {
  (e: 'update:visible' | 'update:mobileVisible', value: string|boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const metaStore = useStore('meta')
const userStore = useStore('user')
const router = useRouter()

const onEntryClick = (route: Route & { meta: any }) => {
  if( route.name ) {
    router.push({ name: route.name })
  }
  if( route.meta?.action ) {
    route.meta.action()
  }

  if( props.mobileVisible ) {
    emit('update:mobileVisible', false)
  }
}

const getSchema = (schema: any, routes: Array<Route>): Array<Route&SchemaNode> => {
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

const getRoutes = (node?: SchemaNode): Array<Route> => {
  const children = node?.children
  const routes: unknown = children || typeof props.entrypoint === 'string'
    ? router.getRoutes().filter((route) => (route.name as string ||'').startsWith(`${props.entrypoint}-`))
    : router.getRoutes() 

  const schema = getSchema(children || props.schema, routes as Array<Route>)
  const entries: Record<string, Route> = {}

  Object.entries(schema).forEach(([key, node]) => {
    if( !node ) {
      return
    }

    const {
      children,
      ...route

    } = node

    const roles = route?.meta?.roles || node.roles
    if( roles && !arraysIntersects(userStore.$currentUser.roles, roles) ) {
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

  const pathMatches = typeof subroute.redirect === 'string'
    ? subroute.redirect === route.path
    : subroute.path === (route.redirectedFrom?.path || route.path)?.split(/\/home$/)[0]

  const nameMatches = subroute.name === (route.redirectedFrom?.name || route.name)
  return pathMatches || nameMatches
}

const routes = ref<Array<Route>>(getRoutes())
const routesWithChildren = computed(() => (
  routes.value.filter((route) => route.children?.length! > 0)
))

watch(() => metaStore.descriptions, () => {
  routes.value = getRoutes() as any
})
</script>

<style scoped src="./sv-navbar.scss"></style>
