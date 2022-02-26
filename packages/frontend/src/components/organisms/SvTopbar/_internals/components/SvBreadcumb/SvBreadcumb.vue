<template>
  <div class="flex items-center relative">
    <div class="text-xl font-bold border-r-2 pr-4 truncate">
      {{ $tc(getTitle(routes[routes.length-1]), 2).capitalize() }}
    </div>
    <div class="flex px-auto items-center truncate flex-0">
      <sv-bare-button @clicked="$router.push({ name: 'dashboard-home' })">
        <unicon name="home" fill="purple" class="mr-2" />
      </sv-bare-button>
      <router-link
        class="_link text-md"
        v-for="(route, index) in routes"
        :key="`route-${index}`"
        :to="{ name: route.name, params: $route.params }"
        >
        {{ $t(getTitle(route)).capitalize() }}
      </router-link>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { Route } from 'frontend/router'

const SvBareButton = defineAsyncComponent(() => import('frontend/components/atoms/SvBareButton/SvBareButton.vue'))

const store = useStore()
const getRoute = () => {
  const route = useRoute()
  return route.matched || [route]
}

const viewTitle = computed(() => store.state.meta.viewTitle)
const routes = computed(getRoute)

const getTitle = (route: Route) => {
  return route.meta?.title === '%viewTitle%'
    ? viewTitle.value
    : route.meta?.title||''
}
</script>
