<template>
  <div class="topbar">
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

    <div class="topbar__main">
      <sv-bare-button
        @clicked="$store.dispatch('meta/swapMenu')"
      >
        <sv-icon name="bars"></sv-icon>
      </sv-bare-button>

      <div class="topbar__widgets">
        <sv-search-bar></sv-search-bar>
      </div>
      <div class="topbar__icons">
        <slot></slot>
      </div>
    </div>
  </div>

  <sv-search-results></sv-search-results>
</template>

<script setup lang="ts">
import { defineAsyncComponent, provide, inject } from 'vue'
import { default as webpackVariables } from 'variables'
import { SvIcon, SvBox } from '../..'
import SvSearchBar from './_internals/components/sv-search-bar/sv-search-bar.vue'
import SvSearchResults from './_internals/components/sv-search-results/sv-search-results.vue'

const SvBareButton = defineAsyncComponent(() => import('../../atoms/sv-bare-button/sv-bare-button.vue'))

provide('iconReactive', true)

const productName = inject('productName')
const productLogo = inject('productLogo')
</script>

<style scoped src="./sv-topbar.scss"></style>
