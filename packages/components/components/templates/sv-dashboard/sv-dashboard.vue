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
        v-model:visible="isMobileMenuVisible"
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
    <sv-sidebar v-model:visible="isSidebarVisible"></sv-sidebar>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, inject, ref } from 'vue'
import { useStore } from 'vuex'
import { default as webpackVariables } from 'variables'

import {
  SvMenu,
  SvTopbar,
  SvBareButton,
  SvFeedback,
  SvSidebar,
  SvIcon

} from '../../'

import SvUtilities from './_internals/components/sv-utilities/sv-utilities.vue'
import SvBreadcumb from './_internals/components/sv-breadcumb/sv-breadcumb.vue'

const store = useStore()
const menuSchema = inject('menuSchema', {})
const notice = inject('notice')

const topbarSlot = inject('topbarSlot')
const runonceSlot = inject('runonceSlot')

onMounted(() => {
  store.dispatch('meta/swapMenu', {
    isVisible: localStorage.getItem('meta:menu:isVisible') !== 'false',
    isMobileVisible: localStorage.getItem('meta:menu:isMobileVisible') !== 'false',
  })
})

const history = window.history

const menu = computed(() => store.state.meta.menu)

const isFeedbackVisible = ref(false)
const isReleasesVisible = ref(false)

const isMenuVisible = computed(() => store.getters['meta/isMenuVisible'])
const isMobileMenuVisible = computed(() => store.getters['meta/isMobileMenuVisible'])
const isSidebarVisible = computed(() => store.state.meta.sidebar.isVisible)
</script>

<style scoped src="./sv-dashboard.scss"></style>
