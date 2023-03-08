<template>
  <component v-if="runonceSlot" :is="runonceSlot"></component>

  <div class="template">
    <div class="template__main">
      <sv-menu
        v-if="menuSchema"
        v-model:visible="metaStore.menu.isVisible"
        entrypoint="dashboard"
        :schema="menuSchema"
      >
        <template #menu-bottom v-if="$slots['menu-bottom']">
          <slot name="menu-bottom"></slot>
        </template>
      </sv-menu>

      <div class="template__content">
        <div v-if="notice" class="template__notice">
          {{ notice }}
        </div>

        <div class="template__top">
          <sv-breadcumb></sv-breadcumb>
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

      <div v-if="$slots.widgets && false" style="
        position: sticky;
        top: 0;
        height: 100vh;
        width: 15rem;
      ">
        <slot name="widgets"></slot>
      </div>
    </div>
  </div>

  <slot name="dashboard-outer"></slot>
</template>

<script setup lang="ts">
import { onMounted, inject } from 'vue'
import { useStore } from '../../../web'
import { SvMenu } from '../../components'

import SvBreadcumb from './_internals/components/sv-breadcumb/sv-breadcumb.vue'

const metaStore = useStore('meta')
const menuSchema = inject('menuSchema', {})
const notice = inject('notice', null)

onMounted(() => {
  metaStore.$patch({
    menu: {
      isVisible: localStorage.getItem('meta:menu:isVisible') !== 'false',
      isMobileVisible: localStorage.getItem('meta:menu:isMobileVisible') !== 'false',
    }
  })

  useStore('user').functions.ping(null, {
    skipLoading: true
  })
})
</script>

<style scoped src="./template.scss"></style>
