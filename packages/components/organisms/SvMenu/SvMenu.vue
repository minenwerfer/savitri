<template>
  <div
    :class="`
      fixed md:sticky top-0 right-0 md:top-[calc(3.2rem+1px)] w-10/12 h-screen md:h-[calc(100vh-3.2rem-1px)] z-40
      bg-white border-r
      animate-slip md:animate-slowfade transition-all ease-in-out
      ${ visible ? 'md:w-[17em]' : 'md:w-[50px] overflow-x-hidden' } 
      ${ mobileVisible || 'hidden md:block' }
      overflow-y-auto overscroll-none
  `">

    <sv-bare-button @clicked="store.dispatch('meta/swapMenu')" class="hidden md:block w-full">
      <div class="flex gap-x-1 items-center transform-all opacity-80 h-12 pl-[5px]">
        <sv-icon name="angle-left" fill="gray" :class="`${!visible && 'rotate-180'} w-10 h-10`"></sv-icon>
        <div v-if="visible" class="text-sm">
          Recolher
        </div>
      </div>
    </sv-bare-button>

    <!-- menu entries -->
    <div class="grid leading-8 md:leading-7">
      <div
        v-for="(route, index) in routes"
        :key="`route-${index}`"
        class="border-y mt-[-1px]"
      >
        <!-- <a @click="onEntryClick(route)" class="menu-entry menu-route mb-2"> -->
        <!--   {{ $tc(route.meta.title, 2).capitalize() }} -->
        <!-- </a> -->

        <!-- subroutes -->
        <div>
          <sv-bare-button
            v-for="(subroute, index) in route.children"
            :key="`subroute-${index}`"
            @clicked="onEntryClick(subroute)"

            :class="`
              flex items-center pl-[12px] py-[10px] hover:bg-blue-100 active:no-underline w-full
              border-l-4 md:border-r-4 md:border-l-0
              ${visible && 'gap-x-3'}
              ${isCurrent(subroute) ? 'border-blue-500 bg-blue-50' : 'border-transparent'}
          `">
            <sv-icon
              :name="subroute.meta?.unicon || 'file'"
              :fill="isCurrent(subroute) ? 'blue' : 'gray'"
            ></sv-icon>
            <div :class="`whitespace-nowrap ${visible || 'md:invisible w-0'}`">
              {{ $tc(subroute.meta.title, 2).capitalize() }}
            </div>
          </sv-bare-button>
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
import { useRoute, useRouter } from 'vue-router'
import {
  SvBareButton,
  SvOverlay,
  SvIcon

} from 'components'

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
