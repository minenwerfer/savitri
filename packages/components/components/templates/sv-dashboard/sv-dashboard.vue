<template>
  <component :is="runonceSlot" v-if="runonceSlot"></component>

  <div class="dashboard">
    <sv-bare-button
      class="dashboard__feedback-button"
      v-if="webpackVariables.feedback"
      @clicked="isFeedbackVisible = true"
    >
        <sv-icon name="comment-dots" fill="white"></sv-icon>
        <div>Feedback</div>
    </sv-bare-button>

    <sv-topbar v-if="!$route.meta?.notopbar">
      <component :is="topbarSlot" v-if="topbarSlot"></component>
      <sv-utilities></sv-utilities>
    </sv-topbar>

    <div class="dashboard__main">
      <sv-menu
        entrypoint="dashboard"
        v-model:visible="metaStore.menu.isVisible"
        :schema="menuSchema"
      ></sv-menu>

      <div class="dashboard__content">
        <div class="dashboard__notice" v-if="notice">
          {{ notice }}
        </div>

        <div class="dashboard__view">
          <sv-breadcumb></sv-breadcumb>
          <router-view />
        </div>
      </div>
    </div>

    <sv-feedback v-model:visible="isFeedbackVisible"></sv-feedback>
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
  SvBareButton,
  SvSidebar,
  SvIcon

} from '../../'

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

<style scoped src="./sv-dashboard.scss"></style>
