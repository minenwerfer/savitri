<template>
  <div class="bg-gray-100">

    <c-bare-button
      class="
        fixed bottom-0 right-0 z-30
        border border-purple-400
        py-2 px-6 rounded-tl-lg
        bg-purple-400 text-white font-semibold items-center flex gap-x-2 hover:opacity-50
      "
      @clicked="isFeedbackVisible = true"
    >
        <unicon name="comment-dots" fill="white"></unicon>
        <div>Feedback</div>
    </c-bare-button>

    <c-top-bar class="md:hidden"></c-top-bar>

    <div :class="`grid md:grid-cols-${isMenuVisible ? 'menu' : 1}`">
      <c-menu
        entrypoint="dashboard"
        v-model:visible="isMenuVisible"
        v-model:mobileVisible="isMenuMobileVisible"
        :schema="menuSchema">
      </c-menu>

      <div class="flex flex-col">
        <div class="px-auto py-auto relative">
          <c-breadcumb class="hidden md:block"></c-breadcumb>
          <router-view />
        </div>
      </div>
    </div>

    <c-feedback v-model:visible="isFeedbackVisible">
    </c-feedback>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { useStore } from 'vuex'
import { CMenu, CBreadcumb, CTopBar, CBareButton, CFeedback } from 'frontend/components'

const store = useStore()
const menuSchema = inject('menuSchema', {})

const isFeedbackVisible = ref(false)
const menu = computed(() => store.state.meta.menu)
const isMenuVisible = computed(() => store.state.meta.menu.isVisible)
const isMenuMobileVisible = computed(() => store.state.meta.menu.isMobileVisible)
</script>
