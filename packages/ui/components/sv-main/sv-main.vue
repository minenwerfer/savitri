<script setup lang="ts">
import { useStore, bootstrapRoutes } from '@savitri/web'
import SvModal from '../dashboard/sv-modal/sv-modal.vue'
import SvPrompt from '../dashboard/sv-prompt/sv-prompt.vue'
import SvToast from '../dashboard/sv-toast/sv-toast.vue'
import '../../scss/main.scss'

const metaStore = useStore('meta')
bootstrapRoutes()
</script>

<template>
  <div
    id="main"
    :class="`
      main
      main--${metaStore.$theme}
      ${metaStore.$theme === 'dark' && 'tw-dark'}
  `">
    <Suspense>
      <router-view v-slot="{ Component }">
        <component :is="Component">
          <template
            v-for="slotName in Object.keys($slots)"
            v-slot:[slotName]
          >
            <slot :name="slotName"></slot>
          </template>
        </component>
      </router-view>
    </Suspense>
    <slot></slot>

    <sv-modal
      v-model="metaStore.modal.visible"
      v-bind="metaStore.modal"
    >
      <div
        v-if="metaStore.modal.body"
        v-html="metaStore.modal.body"
        style="white-space: pre-wrap"
      ></div>

      <component
        v-if="metaStore.modal.component"
        :is="metaStore.modal.component"
      ></component>
    </sv-modal>

    <sv-prompt
      v-if="metaStore.prompt.visible"
      v-bind="metaStore.prompt"
    >
      {{ metaStore.prompt.body }}
    </sv-prompt>

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
  </div>
</template>

<style scoped src="./sv-main.scss"></style>
