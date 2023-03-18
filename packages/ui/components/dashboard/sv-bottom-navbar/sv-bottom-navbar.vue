<template>
  <div class="navbar">
    <sv-icon
      v-clickable
      reactive
      name="bars"
      @click="metaStore.menu.isMobileVisible = !metaStore.menu.isMobileVisible"
    ></sv-icon>

    <sv-icon
      v-clickable
      reactive
      name="home"
      @click="$router.push({ name: 'dashboard-home' })"
    ></sv-icon>

    <sv-icon
      v-clickable
      reactive
      name="user-circle"
      @click="$router.push({ name: 'dashboard-user-profile' })"
    ></sv-icon>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '@savitri/web'
import SvIcon from '../../sv-icon/sv-icon.vue'

const metaStore = useStore('meta')
</script>

<style scoped src="./sv-bottom-navbar.scss"></style>
