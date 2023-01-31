<template>
  <div class="wall">
    <div class="wall__view">
      <sv-branding class="wall__branding"></sv-branding>
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { provide } from 'vue'
import { SvBranding } from '../..'

provide('buttonSize', 'large')
</script>

<style scoped src="./sv-auth-wall.scss"></style>
