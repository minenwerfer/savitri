<template>
  <div class="bg-stone-100">
    <sv-bare-button
      class="
        fixed bottom-0 right-0 z-30
        border border-purple-400
        py-2 px-4 rounded-tl-lg
        bg-purple-600 text-white font-semibold items-center flex gap-x-2 hover:opacity-60 text-sm
      "
      @clicked="isFeedbackVisible = true"
      v-if="webpackVariables.feedback"
    >
        <unicon name="comment-dots" fill="white"></unicon>
        <div>Feedback</div>
    </sv-bare-button>

    <div :class="`grid ${isMenuVisible ? 'md:grid-cols-menu' : 'md:grid-cols-1'}`">
      <sv-menu
        entrypoint="dashboard"
        v-model:visible="isMenuVisible"
        v-model:mobileVisible="isMenuMobileVisible"
        :schema="menuSchema">
      </sv-menu>

      <div :class="`relative flex flex-col md:w-view`">
        <div :class="`order-2 ${$route.meta?.noMargin ? '' : 'px-0 md:px-4 pb-6 pt-4'}`">

          <sv-bare-button
            class="flex mb-8 opacity-80"
            v-if="history.state.back != '/signin' && !$route.meta?.noMargin"
            @clicked="$router.back()"
          >
            <unicon name="arrow-left"></unicon>
            <div>Voltar</div>
          </sv-bare-button>

          <router-view />
        </div>

        <sv-topbar class="sticky inset-0 order-0" v-if="!$route.meta?.noTopbar">
          <sv-utilities></sv-utilities>
        </sv-topbar>

        <div class="bg-orange-400 text-white text-center order-1" v-if="notice">
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
