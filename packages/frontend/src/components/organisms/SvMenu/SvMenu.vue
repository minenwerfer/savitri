<template>
  <div
    style="background: conic-gradient(from 180deg at 50% 66.3%, #08217c 0deg, rgba(8, 33, 124, 0.8) 360deg)"
    :class="`
      fixed md:sticky top-0 right-0 w-10/12 md:w-auto h-screen z-40 pt-4 
      text-white
      animate-slip md:animate-slowfade transition-all
      ${ visible ? '' : 'block md:hidden' } 
      ${ mobileVisible ? '' : 'hidden md:block' }
      overflow-y-auto overscroll-none
  `">

    <div @click="$router.push({ name: 'dashboard-home' })">
      <sv-bare-button
        v-if="!productLogoAlt"
        class="text-center font-semibold text-2xl pt-6 mb-10 hidden md:block"
      >
        {{ productName }}
      </sv-bare-button>
      <img
        v-else
        :src="require(`@/../assets/${productLogoAlt}`).default"
        class="cursor-pointer mx-auto mt-6 mb-14 w-3/5 h-20 object-contain"
      />
    </div>

    <!-- menu entries -->
    <div class="grid leading-8 md:leading-7">
      <div
        v-for="(route, index) in routes"
        :key="`route-${index}`"
        class="py-2 mb-2"
      >
        <a @click="onEntryClick(route)" class="menu-entry menu-route mb-2">
          {{ $tc(route.meta.title, 2).capitalize() }}
        </a>

        <!-- subroutes -->
        <div>
          <a
            v-for="(subroute, index) in route.children"
            :key="`subroute-${index}`"
            @click="onEntryClick(subroute)"
            :class="`
            menu-entry menu-subroute
            ${(subroute.redirect || subroute.path) === $route.path ? 'border-l-8 md:border-r-8 md:border-l-0 border-white' : ''}
          `">
            {{ $tc(subroute.meta.title, 2).capitalize() }}
          </a>
        </div>

      </div>
    </div>
  </div>

  <sv-overlay
    @click="closeMobile"
    :class="`${ mobileVisible ? '' : 'hidden' } md:hidden z-30`"
  ></sv-overlay>

</template>

<script setup lang="ts">
import { ref, watch, inject } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { SvBareButton, SvOverlay } from 'frontend/components'
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
const productLogoAlt = inject('productLogoAlt', undefined)

const closeMobile = () => {
  store.dispatch('meta/swapMenu', { desktop: true, mobile: false })
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

const routes = ref<Route[]>(getRoutes())

watch(() => store.state.meta?.globalDescriptions, () => {
  routes.value = getRoutes()
    .sort((a, b) => (a.meta?.order||0) < (b.meta?.order||0) ? -1 : 1)
})
</script>

<style>
.menu-entry {
  @apply block;
  @apply pl-4;
  @apply select-none;
}

.menu-route {
  @apply font-semibold;
  @apply uppercase;
  @apply text-sm;
}

.menu-subroute {
  @apply md:hover:bg-gray-300;
  @apply py-1;
  @apply cursor-pointer;
}
</style>
