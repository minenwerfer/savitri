<template>
  <div class="layout">
    <div class="layout__main">
      <sv-navbar
        v-if="menuSchema"
        v-model:visible="metaStore.menu.visible"
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

      <div class="layout__content">
        <div v-if="!$route.meta?.noTopbar" class="layout__top-bg"></div>
        <div v-if="!$route.meta?.noTopbar" class="layout__top">
          <sv-breadcumb style="margin-right: 1.8rem"></sv-breadcumb>
          <router-view name="topbar"></router-view>
          <div
            v-if="$slots['dashboard-top']"
            style="margin-left: auto"
          >
            <slot name="dashboard-top"></slot>
          </div>

          <sv-icon
            v-clickable
            v-if="$slots.panels"
            small
            name="web-section"
            style="
              align-self: center;
              padding-left: 1rem;
              margin-left: auto;
            "
            @click="metaStore.swapPanel"
          ></sv-icon>
        </div>
        <div class="layout__view">
          <router-view />
        </div>
      </div>

      <div
        v-if="
          $slots.panels
          && metaStore.panel.visible
          && !$route.meta?.noTopbar
        "
        class="layout__panel"
      >
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
import SvIcon from '../../components/sv-icon/sv-icon.vue'
import SvNavbar from '../../components/dashboard/sv-navbar/sv-navbar.vue'
import SvBottomNavbar from '../../components/dashboard/sv-bottom-navbar/sv-bottom-navbar.vue'

import SvBreadcumb from './_internals/components/sv-breadcumb/sv-breadcumb.vue'

const metaStore = useStore('meta')
const menuSchema = inject('menuSchema', {})

onMounted(() => {
  metaStore.$patch({
    panel: {
      visible: localStorage.getItem("meta:panel:visible") !== 'false'
    },
    menu: {
      visible: localStorage.getItem('meta:menu:visible') !== 'false',
    }
  })

  useStore('user').functions.ping(null, {
    skipLoading: true
  })
})
</script>

<style scoped src="./layout.scss"></style>
