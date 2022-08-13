<template>
  <div :class="`menu ${!visible && 'menu--hidden'}`">
    <sv-menu-header></sv-menu-header>

    <!-- menu entries -->
    <div class="menu__entries">
      <div
        v-for="(route, index) in routes"
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
          <sv-bare-button
            v-for="(subroute, index) in route.children"
            :key="`subroute-${index}`"
            :class="`
              menu__subroute
              ${isCurrent(subroute) && 'menu__subroute--current'}
            `"
            @clicked="onEntryClick(subroute)"
          >
            <sv-icon
              :name="subroute.meta?.unicon || 'file'"
              :fill="isCurrent(subroute) ? 'blue' : 'gray'"
              class="menu__icon"
            >
              {{ $tc(subroute.meta.title, 2).capitalize() }}
            </sv-icon>
            <!-- <div class="menu__subroute--title"> -->
            <!--   {{ $tc(subroute.meta.title, 2).capitalize() }} -->
            <!-- </div> -->
          </sv-bare-button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { SvBareButton, SvIcon } from '../../'

import { useStore } from '@savitri/web'
import { Route } from '@savitri/web/router'

import SvMenuHeader from './_internals/components/sv-menu-header/sv-menu-header.vue'

type Props = {
  entrypoint?: string
  visible: boolean
  schema?: any
}

const props = defineProps<Props>()

const metaStore = useStore('meta')
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

const getRoutes = (children?: Route): Array<Route> => {
  const routes = children || typeof props.entrypoint === 'string'
    ? router.getRoutes().filter((route) => (route.name ||'').startsWith(`${props.entrypoint}-`))
    : router.getRoutes()

  const schema = getSchema(children || props.schema, routes as Array<Route>)
  const entries: Record<string, Route> = {}

  Object.entries(schema)
    .filter(([, value]) => !!value)
    .forEach(([key, value]) => {
      const { children, ...route } = value
      entries[key] = route
      entries[key].meta = route.meta || {
        title: key
      }

      if( children ) {
        entries[key].children = getRoutes(children)
      }
    })

  return Object.values(entries) as Array<Route>
}

const isCurrent = (subroute: any) => {
  const route = useRoute()
  return (subroute.redirect || subroute.path) === route.path
}

const routes = ref<Array<Route>>(getRoutes())

watch(() => metaStore.descriptions, () => {
  routes.value = getRoutes()
    .sort((a, b) => (a.meta?.order||0) < (b.meta?.order||0) ? -1 : 1)
})
</script>

<style scoped src="./sv-menu.scss"></style>
