<template>
  <div
    :class="`
      menu
      no-print
      ${!visible && 'menu--hidden'}
      ${getLayoutOption('noTopbar') && 'menu--with-branding'}
  `">
    <sv-branding
      v-clickable
      v-if="getLayoutOption('noTopbar')"
      click="dashboard"
      class="menu__branding"
    ></sv-branding>

    <sv-menu-header class="menu__header"></sv-menu-header>

    <!-- menu entries -->
    <div class="menu__entries">
      <div
        v-for="(entry, index) in routesWithChildren"
        :key="`entry-${index}`"
        class="menu__entry"
      >
        <sv-icon
          v-clickable
          v-if="visible && entry.shrink"
          name="angle-up"
          :class="`
            menu__entry-title
            ${shrink[index] && 'menu__entry-title--shrinked'}
          `"

          @click="shrink[index] = !shrink[index]"
        >
          {{ $tc(entry.meta?.title, 2).capitalize() }}
        </sv-icon>

        <div
          v-else
          class="menu__entry-title"
        >
          {{ $tc(entry.meta?.title, 2).capitalize() }}
        </div>


        <!-- subroutes -->
        <div :class="`
          menu__routes
          ${(shrink[index] && visible) && 'menu__routes--shrinked'}
        `">
          <sv-icon
            v-clickable
            v-for="route in entry.children"
            :key="route.name"
            :class="`
              menu__route
              ${isCurrent(route) && 'menu__route--current'}
            `"

            :name="route.meta?.icon || 'file'"
            :title="$tc(route.meta.title, 2).capitalize()"
            @click="onEntryClick(route)"
          >
            {{ $tc(route.meta.title, 2).capitalize() }}
          </sv-icon>
        </div>

      </div>
    </div>

    <div v-if="$slots['menu-bottom']" class="menu__bottom">
      <slot name="menu-bottom"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { arraysIntersects } from '@semantic-api/common'
import { useStore, Route, MenuSchema } from '../../../../web'
import { SvIcon, SvBranding } from '../../'

import SvMenuHeader from './_internals/components/sv-menu-header/sv-menu-header.vue'

type Props = {
  entrypoint?: string
  visible: boolean
  schema: MenuSchema
}

type SchemaNode = {
  roles?: Array<string>
  children?: Route
}

const props = defineProps<Props>()

const metaStore = useStore('meta')
const userStore = useStore('user')
const router = useRouter()

const shrink = ref<Record<string, boolean>>(
  Object.values(props.schema).reduce((a: Record<string, boolean>, route: any, i) => {
    return {
      ...a,
      [i]: !!route.shrink
    }
  }, {})
)

const onEntryClick = (route: Route & { meta: any }) => {
  if( route.name ) {
    router.push({ name: route.name })
  }
  if( route.meta?.action ) {
    route.meta.action()
  }
}

const getSchema = (schema: any, routes: Array<Route>): Array<Route&SchemaNode> => {
  if( !Array.isArray(schema) ) {
    return schema
  }

  return schema.map((s) => {
    return typeof s === 'string'
      ? routes.find((route) => route.name === s)
      : s
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
  return (subroute.redirect || subroute.path) === route.path
}

const routes = ref<Array<Route & { shrink?: boolean }>>(getRoutes())
const routesWithChildren = computed(() => (
  routes.value.filter((route) => route.children?.length > 0)
))

watch(() => metaStore.descriptions, () => {
  routes.value = getRoutes() as any
})
</script>

<style scoped src="./sv-menu.scss"></style>
