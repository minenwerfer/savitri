<template>
  <div class="topbar">
    <div class="topbar__content">
      <div
        class="topbar__branding"
        @click="$router.push({ name: 'dashboard-home' })"
      >
        <div v-if="!productLogo">{{ productName }}</div>
        <img
          v-else
          :src="require(`@/assets/${productLogo}`).default"
          class="topbar__logo"
        />
      </div>

      <sv-bare-button
        @clicked="$store.dispatch('meta/swapMenu')"
        class="mobile-only"
      >
        <sv-icon name="bars"></sv-icon>
      </sv-bare-button>

      <div class="topbar__icons">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, provide, inject } from 'vue'
import { default as webpackVariables } from 'variables'
import { SvIcon } from '../..'
const SvBareButton = defineAsyncComponent(() => import('../../atoms/sv-bare-button/sv-bare-button.vue'))

provide('iconReactive', true)

const productName = inject('productName')
const productLogo = inject('productLogo')
</script>

<style scoped src="./sv-topbar.scss"></style>
