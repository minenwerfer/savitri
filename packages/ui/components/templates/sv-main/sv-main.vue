<template>
  <div
    id="main"
    :class="`
      main
      main--${metaStore.$theme}
      ${metaStore.$theme === 'dark' && 'tw-dark'}
  `">
    <router-view></router-view>
    <slot></slot>

    <sv-modal
      v-model:visible="metaStore.modal.isVisible"
      v-bind="metaStore.modal"
    >
      <div>
          <p v-if="metaStore.modal.body" v-html="metaStore.modal.body"></p>
          <img v-if="metaStore.modal.image" :src="metaStore.modal.image" />
          <component v-if="metaStore.modal.component" :is="metaStore.modal.component"></component>
      </div>
    </sv-modal>

    <sv-prompt
      v-if="metaStore.prompt.isVisible"
      v-bind="metaStore.prompt"
    >
      {{ metaStore.prompt.body }}
    </sv-prompt>
  </div>

  <div class="main__toasts">
    <sv-toast
      v-for="toast in metaStore.toasts"
      v-bind="toast"
      :key="`toast-${toast.itr}`"
    >
      <div v-html="
      Array.isArray(toast.text)
        ? $t(...toast.text)
        : toast.text
      "></div>
    </sv-toast>
  </div>
</template>

<script setup lang="ts">
import { useStore, bootstrapRoutes } from '../../../../web'
import { SvModal, SvPrompt, SvToast } from '../../'
import '../../../scss/main.scss'

const metaStore = useStore('meta')
bootstrapRoutes()
</script>

<style scoped src="./sv-main.scss"></style>
