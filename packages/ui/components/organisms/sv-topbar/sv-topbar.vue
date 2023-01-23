<template>
  <div
    :class="{
      topbar: true,
      'topbar--mobileOnly': getLayoutOption('noTopbar')
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

      <div class="topbar__widgets">
        <sv-search-bar></sv-search-bar>
      </div>
      <div class="topbar__icons">
        <slot></slot>

        <sv-info where="bottom">
          <template #text>Menu</template>
          <sv-icon
            v-clickable
            name="user-circle"
            @click="shortcutsVisible = true"
          ></sv-icon>
        </sv-info>
      </div>
    </div>
  </div>

  <sv-search-results></sv-search-results>
  <sv-shortcuts v-overlay="{ click: () => { shortcutsVisible = false } }"></sv-shortcuts>
</template>

<script setup lang="ts">
import { provide } from 'vue'
import { useStore } from '../../../../web'
import { SvInfo, SvIcon, SvBranding } from '../..'

import SvSearchBar from './_internals/components/sv-search-bar/sv-search-bar.vue'
import SvSearchResults from './_internals/components/sv-search-results/sv-search-results.vue'
import SvShortcuts from './_internals/components/sv-shortcuts/sv-shortcuts.vue'

import { shortcutsVisible } from './_internals/store'

provide('iconReactive', true)
const metaStore = useStore('meta')
</script>

<style scoped src="./sv-topbar.scss"></style>
