<template>
  <c-modal :close-hint="false">
    <template #title>
      <slot name="title"></slot>
    </template>

    <template #body>
      <slot name="body"></slot>
    </template>

    <template #footer>
      <div class="flex gap-x-2">
        <c-button
          v-for="(action, index) in actions"
          :key="`action-${index}`"
          :type="action.type"

          @clicked="onClick(action)"
        >
          {{ action.title }}
        </c-button>
      </div>
    </template>
  </c-modal>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { useStore } from 'vuex'
import { CButton } from 'frontend/components'

const CModal = defineAsyncComponent(() => import('frontend/components/organisms/CModal/CModal.vue'))
const store = useStore()

const props = defineProps<{
  actions: any[]
}>()

const onClick = (action: any) => {
  store.dispatch('meta/fulfillPrompt', action.name)
}
</script>
