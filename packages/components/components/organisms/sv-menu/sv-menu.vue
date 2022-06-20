<template>
  <div :class="`menu ${!visible && 'menu--hidden'}`">
    <!-- Internals!!!! -->
    <div class="menu__profile">
      <sv-picture
        :file="store.getters['user/current'].picture"
        class="menu__picture"
      ></sv-picture>

      <div>
        {{ store.getters['user/current'].first_name }}
      </div>
    </div>

    <!-- menu entries -->
    <div class="menu__entries">
      <div
        v-for="(route, index) in routes"
        :key="`route-${index}`"
        class="mt-[-1px] py-2"
      >
        <a
          class="menu__group px-2 text-xs uppercase font-bold"
          @click="onEntryClick(route)"
        >
          {{ $tc(route.meta.title, 2).capitalize() }}
        </a>

        <!-- subroutes -->
        <div>
          <sv-bare-button
            v-for="(subroute, index) in route.children"
            :key="`subroute-${index}`"
            @clicked="onEntryClick(subroute)"
            class="w-full"
          >
            <div
              :class="`
                menu__subroute flex items-center hover:bg-blue-100 active:no-underline w-full
                gap-x-2 rounded-lg 
                ${isCurrent(subroute) ? 'border-blue-500 bg-blue-100' : 'border-transparent'}
            `">
              <sv-icon
                :name="subroute.meta?.unicon || 'file'"
                :fill="isCurrent(subroute) ? 'blue' : 'gray'"
                class="menu__icon"
              ></sv-icon>
              <div :class="`whitespace-nowrap opacity-60`">
                {{ $tc(subroute.meta.title, 2).capitalize() }}
              </div>
            </div>
          </sv-bare-button>
        </div>

      </div>
    </div>
  </div>

  <sv-overlay
    @click="closeMobile"
    v-if="false"
    class="z-10"
  ></sv-overlay>

</template>

<script setup lang="ts">
import { ref, watch, inject } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import {
  SvBareButton,
  SvOverlay,
  SvIcon,
  SvPicture

} from '../../'

import { Route } from 'frontend/router'

const props = defineProps<{
  entrypoint?: string
  visible: boolean
  mobileVisible: boolean
  schema?: any
}>()

const store = useStore()
const router = useRouter()

const tick = ref(0)
const productName = inject('productName')
const productLogo = inject('productLogo', undefined)

const closeMobile = () => {
  store.dispatch('meta/swapMenu', { isMobileVisible: false })
}

const onEntryClick = (route: Route & { meta: any }) => {
  if( route.name ) {
    router.push({ name: route.name })
  }
  if( route.meta?.action ) {
    route.meta.action()
  }

  closeMobile()
}

const getSchema = (schema: any, routes: Route[]) => {
  if( !Array.isArray(schema) ) {
    return schema
  }

  return schema.map((s) => {
    return typeof s === 'string'
      ? routes.find((route: Route) => route.name === s)
      : s
  })
}

const getRoutes = (children?: Route, subschema?: any) => {
  const routes: unknown = children || typeof props.entrypoint === 'string'
    ? router.getRoutes().filter((route) => (route.name ||'').startsWith(`${props.entrypoint}-`))
    : router.getRoutes()

  const schema = getSchema(subschema || props.schema, routes as Route[])
  const entries: { [key: string]: Route } = {}

  Object.entries(schema)
    .filter(([, value]) => !!value)
    .map(([key, value]: [string, any]) => [key, { ...value, subschema: value.children }])
    .forEach(([key, value]) => {
      const { children, subschema, ...route } = value
      entries[key] = route
      entries[key].meta = route.meta || {
        title: key
      }

      if( children ) {
        entries[key].children = getRoutes(children, subschema)
      }
    })

  return [
    ...Object.values(entries) as Route[]
  ]
}

const isCurrent = (subroute: any) => {
  const route = useRoute()
  return (subroute.redirect || subroute.path) === route.path
}

const routes = ref<Route[]>(getRoutes())

watch(() => store.state.meta?.globalDescriptions, () => {
  routes.value = getRoutes()
    .sort((a, b) => (a.meta?.order||0) < (b.meta?.order||0) ? -1 : 1)
})
</script>

<style scoped src="./sv-menu.scss"></style>
