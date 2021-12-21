<template>
  <div
    @click="closeMobile"
    :class="`${ mobileVisible ? '' : 'hidden' } md:hidden fixed inset-0 w-screen h-screen bg-gray-900 opacity-60 z-30 transition-all`"
    ></div>

  <div :class="`
    fixed md:sticky top-0 right-0 w-10/12 md:w-auto h-screen z-40
    bg-white shadow-lg pt-4 border-l
    animate-slip md:animate-slowfade transition-all
    ${ visible ? '' : 'block md:hidden' } 
    ${ mobileVisible ? '' : 'hidden md:block' }
    overflow-y-scroll
  `">

    <div @click="$router.push({ name: 'dashboard-home' })">
      <c-bare-button
        v-if="!productLogo"
        class="text-center font-semibold text-2xl pt-6 mb-10 hidden md:block"
      >
        {{ productName }}
      </c-bare-button>
      <img
        v-else
        :src="require('@/../assets/logo.png').default"
        class="cursor-pointer mx-auto mt-4 mb-10"
      />
    </div>

    <!-- menu entries -->
    <div class="grid pl-2 leading-8 md:leading-7">
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
            ${(subroute.redirect || subroute.path) === $route.path ? 'border-l-8 md:border-l-0 md:border-r-8 border-purple-600 bg-gray-200' : ''}
          `">
            {{ $tc(subroute.meta.title, 2).capitalize() }}
          </a>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import { ref, watch, inject } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { CBareButton } from 'frontend/components'

export default {
  components: {
    CBareButton,
  },

  props: {
    entrypoint: {
      type: String,
      required: false,
    },
    visible: {
      type: Boolean,
      required: true,
    },
    mobileVisible: {
      type: Boolean,
      required: true,
    },
    schema: {
      type: Object,
      required: false,
    }
  },

  methods: {
    closeMobile() {
      this.store.dispatch('meta/swapMenu', { desktop: true, mobile: false })
    },
    onEntryClick(route) {
      if( route.name ) {
        this.$router.push({ name: route.name })
      }
      if( route.meta?.action ) {
        route.meta.action()
      }

      this.closeMobile()
    }
  },

  setup(props) {
    const store = useStore()
    const router = useRouter()

    const getSchema = (schema, routes) => {
      if( !Array.isArray(schema) ) {
        return schema
      }

      return schema.map((s) => {
        return typeof s === 'string'
          ? routes.find((route) => route.name === s)
          : s
      })
    }

    const getRoutes = (children, subschema) => {
      const routes = children || typeof props.entrypoint === 'string'
        ? router.getRoutes().filter((route) => route.name.startsWith(`${props.entrypoint}-`))
        : router.getRoutes()

      const schema = getSchema(subschema || props.schema, routes)
      const entries = {}

      Object.entries(schema)
        .filter(([, value]) => !!value)
        .map(([key, value]) => [key, { ...value, subschema: value.children }])
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
        ...Object.values(entries)
      ]
    }

    const routes = ref(getRoutes())

    watch(() => store.state.meta?.globalDescriptions, () => {
      routes.value = getRoutes()
        .sort((a, b) => (a.order||0) < (b.order||0) ? -1 : 1)
    })

    return {
      store,
      tick: ref(0),
      routes,
      productName: inject('productName'),
      productLogo: inject('productLogo')
    }
  },
}
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
  @apply opacity-40;
  @apply text-sm;
}

.menu-subroute {
  @apply md:hover:bg-gray-300;
  @apply py-1;
  @apply cursor-pointer;
  @apply opacity-70;
}
</style>
