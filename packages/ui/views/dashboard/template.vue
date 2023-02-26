<template>
  <component v-if="runonceSlot" :is="runonceSlot"></component>

  <div class="template">
    <sv-topbar>
      <component :is="topbarSlot" v-if="topbarSlot"></component>
      <sv-utilities></sv-utilities>
    </sv-topbar>

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

        <div class="template__view">
          <div class="template__top">
            <sv-breadcumb></sv-breadcumb>
            <slot name="dashboard-top"></slot>
          </div>

          <h1 v-if="getLayoutOption('noTopbar') && !route.meta?.noTitle">
            {{ viewTitle }}
          </h1>
          <router-view />
        </div>
      </div>
    </div>
  </div>

  <slot name="dashboard-outer"></slot>
</template>

<script setup lang="ts">
import { onMounted, inject } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '../../../web'
import { SvMenu, SvTopbar } from '../../components'

import SvUtilities from './_internals/components/sv-utilities/sv-utilities.vue'
import SvBreadcumb from './_internals/components/sv-breadcumb/sv-breadcumb.vue'

const route = useRoute()
const metaStore = useStore('meta')
const menuSchema = inject('menuSchema', {})
const notice = inject('notice', null)

const topbarSlot = inject('topbarSlot', null)
const runonceSlot = inject('runonceSlot', null)

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
