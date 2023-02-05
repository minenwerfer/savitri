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
      {{ getTitle(route) || viewTitle }}
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Route } from '../../../../../../web'

const getRoute = () => {
  const route = useRoute()
  return route.matched || [route]
}

const routes = computed(getRoute)

const getTitle = (route: Route) => {
  return route.meta?.title === '%viewTitle%'
    ? null
    : route.meta?.title||''
}
</script>

<style scoped src="./sv-breadcumb.scss"></style>
