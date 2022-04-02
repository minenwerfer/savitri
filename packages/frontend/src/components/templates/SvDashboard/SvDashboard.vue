<template>
  <div class="bg-gray-100">
    <sv-bare-button
      class="
        fixed bottom-0 right-0 z-30
        py-1 px-4 rounded-tl-lg
        border border-green-800
        bg-green-600 text-white font-semibold items-center flex gap-x-2 hover:opacity-60 text-sm
      "
      @clicked="isFeedbackVisible = true"
      v-if="webpackVariables.feedback"
    >
        <unicon name="comment-dots" fill="white"></unicon>
        <div>Feedback</div>
    </sv-bare-button>

    <div class="flex flex-wrap">
      <sv-topbar class="sticky inset-0 z-30 w-full" v-if="!$route.meta?.noTopbar">
        <sv-utilities></sv-utilities>
      </sv-topbar>

      <sv-menu
        entrypoint="dashboard"
        v-model:visible="isMenuVisible"
        v-model:mobileVisible="isMenuMobileVisible"
        :schema="menuSchema"
      ></sv-menu>

      <div class="relative inline-flex flex-col flex-grow md:w-0 overflow-y-scroll">
        <div :class="`order-2 ${$route.meta?.noMargin || 'px-0 md:px-4 pb-6 pt-2'}`">
          <sv-bare-button
            class="flex mb-8 opacity-60"
            v-if="history.state.back != '/signin' && !$route.meta?.noMargin"
            @clicked="$router.back()"
          >
            <unicon name="arrow-left"></unicon>
            <div>Voltar</div>
          </sv-bare-button>

          <div :class="$route.meta?.noMargin || 'mt-4'">
            <router-view />
          </div>
        </div>

        <div class="bg-orange-300 text-white text-center text-sm font-semibold order-1" v-if="notice">
          {{ notice }}
        </div>

      </div>
    </div>

    <sv-feedback v-model:visible="isFeedbackVisible"></sv-feedback>
    <sv-sidebar v-model:visible="isSidebarVisible"></sv-sidebar>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { useStore } from 'vuex'
import { default as webpackVariables } from 'variables'

import {
  SvMenu,
  SvTopbar,
  SvBareButton,
  SvFeedback,
  SvSidebar

} from 'frontend/components'

import SvUtilities from './_internals/components/SvUtilities/SvUtilities.vue'

const store = useStore()
const menuSchema = inject('menuSchema', {})
const notice = inject('notice', undefined)

const history = window.history

const menu = computed(() => store.state.meta.menu)

const isFeedbackVisible = ref(false)
const isReleasesVisible = ref(false)

const isMenuVisible = computed(() => store.state.meta.menu.isVisible)
const isMenuMobileVisible = computed(() => store.state.meta.menu.isMobileVisible)
const isSidebarVisible = computed(() => store.state.meta.sidebar.isVisible)
</script>
