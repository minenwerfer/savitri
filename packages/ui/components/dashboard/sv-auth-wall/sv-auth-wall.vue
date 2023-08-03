<script setup lang="ts">
import { provide } from 'vue'

provide('buttonSize', 'large')
provide('buttonVariant', 'brand')
provide('inputVariant', 'bold')
provide('innerInputLabel', true)
</script>

<template>
  <div
    v-theme:default
    class="wall"
  >
    <img
      src="/static/logo-authwall.png"
      class="wall__branding"
      @click="$router.push('/dashboard')"
    />
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

<style scoped src="./sv-auth-wall.scss"></style>
