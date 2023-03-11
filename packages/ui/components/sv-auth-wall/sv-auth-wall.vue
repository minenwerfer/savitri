<template>
  <div
    v-theme:default
    class="wall"
  >
    <sv-branding alt class="wall__branding"></sv-branding>
    <div v-if="$slots['authwall-content']" class="wall__content">
      <slot name="authwall-content"></slot>
    </div>

    <div class="wall__view">
      <div class="wall__view-center">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { provide } from 'vue'
import { SvBranding } from '..'

provide('buttonSize', 'large')
provide('buttonVariant', 'brand')
provide('inputVariant', 'bold')
</script>

<style scoped src="./sv-auth-wall.scss"></style>
