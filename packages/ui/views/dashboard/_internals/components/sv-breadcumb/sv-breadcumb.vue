<template>
  <div class="
    no-print
    breadcumb
  ">
    <router-link
      v-for="(route, index) in routes"
      :key="`route-${index}`"
      :to="{ name: route.name, params: $route.params }"
      class="breadcumb__link"
    >
      {{ $tc(getTitle(route), 2).capitalize() }}
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore, Route } from '../../../../../../web'

const metaStore = useStore('meta')
const getRoute = () => {
  const route = useRoute()
  return route.matched || [route]
}

const viewTitle = computed(() => metaStore.view.title)
const routes = computed(getRoute)

const getTitle = (route: Route) => {
  return route.meta?.title === '%viewTitle%'
    ? viewTitle.value
    : route.meta?.title||''
}
</script>

<style scoped src="./sv-breadcumb.scss"></style>
