<template>
  <component v-if="runonceSlot" :is="runonceSlot"></component>

  <div class="template">
    <sv-topbar v-if="!route.meta?.notopbar">
      <component :is="topbarSlot" v-if="topbarSlot"></component>
      <sv-utilities></sv-utilities>
    </sv-topbar>

    <div class="template__main">
      <sv-menu
        v-model:visible="metaStore.menu.isVisible"
        entrypoint="dashboard"
        :schema="menuSchema"
      ></sv-menu>

      <div class="template__content">
        <div v-if="notice" class="template__notice">
          {{ notice }}
        </div>

        <div class="template__view">
          <sv-breadcumb></sv-breadcumb>
          <router-view />
        </div>
      </div>
    </div>
  </div>
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

  useStore('user').functions.ping()
})
</script>

<style scoped src="./template.scss"></style>
