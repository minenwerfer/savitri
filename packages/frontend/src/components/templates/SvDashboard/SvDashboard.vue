<template>
  <div class="bg-gray-100">

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

    <sv-top-bar class="md:hidden">
      <sv-profile-thumb></sv-profile-thumb>
      <sv-notifications v-if="webpackVariables.notification"></sv-notifications>
    </sv-top-bar>

    <div :class="`grid md:grid-cols-${isMenuVisible ? 'menu' : 1}`">
      <sv-menu
        entrypoint="dashboard"
        v-model:visible="isMenuVisible"
        v-model:mobileVisible="isMenuMobileVisible"
        :schema="menuSchema">
      </sv-menu>

      <div :class="`relative flex flex-col md:w-view ${$route.meta?.noMargin ? '' : 'px-0 md:px-5 py-auto'}`">
        <div class="order-2">
          <router-view />
        </div>

        <sv-breadcumb class="hidden md:block order-1" v-if="!($route.meta?.noMargin || $route.meta?.noBreadcumb)">
          <sv-profile-thumb></sv-profile-thumb>
          <sv-notifications v-if="webpackVariables.notification"></sv-notifications>
        </sv-breadcumb>

      </div>
    </div>

    <sv-feedback v-model:visible="isFeedbackVisible">
    </sv-feedback>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { useStore } from 'vuex'
import { default as webpackVariables } from 'variables'
import { SvMenu, SvBreadcumb, SvTopBar, SvBareButton, SvFeedback, SvProfileThumb, SvNotifications } from 'frontend/components'

const store = useStore()
const menuSchema = inject('menuSchema', {})

const isFeedbackVisible = ref(false)
const menu = computed(() => store.state.meta.menu)
const isMenuVisible = computed(() => store.state.meta.menu.isVisible)
const isMenuMobileVisible = computed(() => store.state.meta.menu.isMobileVisible)
</script>
