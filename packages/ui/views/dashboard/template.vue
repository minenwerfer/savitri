<template>
  <div class="template">
    <div class="template__main">
      <sv-navbar
        v-if="menuSchema"
        v-model:visible="metaStore.menu.isVisible"
        v-model:mobile-visible="metaStore.menu.isMobileVisible"
        entrypoint="dashboard"
        :schema="menuSchema"
      >
        <template #navbar-action v-if="$slots['navbar-action']">
          <slot name="navbar-action"></slot>
        </template>
        <template #navbar-bottom v-if="$slots['navbar-bottom']">
          <slot name="navbar-bottom"></slot>
        </template>
      </sv-navbar>

      <div class="template__content">
        <div class="template__top-bg"></div>
        <div class="template__top">
          <sv-breadcumb style="margin-right: 1.8rem"></sv-breadcumb>
          <router-view name="topbar"></router-view>
          <div
            v-if="$slots['dashboard-top']"
            style="margin-left: auto"
          >
            <slot name="dashboard-top"></slot>
          </div>
        </div>
        <div class="template__view">
          <router-view />
        </div>
      </div>

      <div v-if="$slots.panels" style="
        position: sticky;
        top: 0;
        height: 100vh;
        width: 15rem;
      ">
        <slot name="panels"></slot>
      </div>
    </div>

    <sv-bottom-navbar></sv-bottom-navbar>
  </div>

  <slot name="dashboard-outer"></slot>
</template>

<script setup lang="ts">
import { onMounted, inject } from 'vue'
import { useStore } from '@savitri/web'
import SvNavbar from '../../components/dashboard/sv-navbar/sv-navbar.vue'
import SvBottomNavbar from '../../components/dashboard/sv-bottom-navbar/sv-bottom-navbar.vue'

import SvBreadcumb from './_internals/components/sv-breadcumb/sv-breadcumb.vue'

const metaStore = useStore('meta')
const menuSchema = inject('menuSchema', {})

onMounted(() => {
  metaStore.$patch({
    menu: {
      isVisible: localStorage.getItem('meta:menu:isVisible') !== 'false',
    }
  })

  useStore('user').functions.ping(null, {
    skipLoading: true
  })
})
</script>

<style scoped src="./template.scss"></style>
