<template>
  <div
    :class="{
      topbar: true,
      'topbar--mobileOnly': getLayoutOption('noTopbar'),
      'no-print': true
    }"
  >
    <sv-branding
      v-clickable
      click="dashboard"
      class="topbar__branding"
    ></sv-branding>

    <div class="topbar__main">
      <sv-icon
        v-clickable
        name="bars"
        @click="metaStore.swapMenu"
      ></sv-icon>

      <div class="topbar__icons">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { provide } from 'vue'
import { useStore } from '../../../../web'
import { SvIcon, SvBranding } from '../..'

provide('iconReactive', true)
const metaStore = useStore('meta')
</script>

<style scoped src="./sv-topbar.scss"></style>
