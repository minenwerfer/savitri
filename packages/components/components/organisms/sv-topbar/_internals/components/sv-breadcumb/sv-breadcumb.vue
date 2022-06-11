<template>
  <div class="flex items-center">
    <!-- <div class="text-xl font-bold border-r-2 pr-4 truncate"> -->
    <!--   {{ $getTitle(routes[routes.length-1]) }} -->
    <!-- </div> -->
    <div class="flex items-center truncate flex-0">
      <!-- <sv-bare-button @clicked="$router.push({ name: 'dashboard-home' })"> -->
      <!--   <unicon name="home" fill="gray" class="mr-2" /> -->
      <!-- </sv-bare-button> -->
      <router-link
        class="_link first:opacity-60"
        v-for="(route, index) in routes"
        :key="`route-${index}`"
        :to="{ name: route.name, params: $route.params }"
      >
        {{ $tc(getTitle(route), 2).capitalize() }}
      </router-link>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { Route } from 'frontend/router'

const SvBareButton = defineAsyncComponent(() => import('../../../../../atoms/sv-bare-button/sv-bare-button.vue'))

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
