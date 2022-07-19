<template>
  <div class="breadcumb">
    <router-link
      class="breadcumb__link"
      v-for="(route, index) in routes"
      :key="`route-${index}`"
      :to="{ name: route.name, params: $route.params }"
    >
      {{ $tc(getTitle(route), 2).capitalize() }}
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { Route } from '@savitri/web/router'

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

<style scoped src="./sv-breadcumb.scss"></style>
