<template>
  <component v-if="runonceSlot" :is="runonceSlot"></component>

  <div class="template">
    <sv-icon
      v-clickable
      v-if="webpackVariables.feedback"
      name="comment-dots"
      class="template__feedback-button"
      @click="isFeedbackVisible = true"
    >
      Feedback
    </sv-icon>

    <sv-topbar v-if="!$route.meta?.notopbar">
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

    <sv-feedback></sv-feedback>
    <sv-sidebar v-model:visible="metaStore.sidebar.isVisible"></sv-sidebar>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, inject, ref } from 'vue'
import { useStore } from '@savitri/web'
import { default as webpackVariables } from 'variables'

import {
  SvMenu,
  SvTopbar,
  SvSidebar,
  SvIcon

} from '../..'

import SvUtilities from './_internals/components/sv-utilities/sv-utilities.vue'
import SvBreadcumb from './_internals/components/sv-breadcumb/sv-breadcumb.vue'
import SvFeedback from './_internals/components/sv-feedback/sv-feedback.vue'

import { isFeedbackVisible } from './_internals/store'

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
})

const isReleasesVisible = ref(false)
</script>

<style scoped src="./template.scss"></style>
