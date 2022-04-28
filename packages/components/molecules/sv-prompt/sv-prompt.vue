<template>
  <sv-modal :close-hint="false">
    <template #title>
      <slot name="title"></slot>
    </template>

    <template #body>
      <slot name="body"></slot>
    </template>

    <template #footer>
      <div class="flex gap-x-2">
        <sv-button
          v-for="(action, index) in actions"
          :key="`action-${index}`"
          :type="action.type"

          @clicked="onClick(action)"
        >
          {{ action.title }}
        </sv-button>
      </div>
    </template>
  </sv-modal>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { useStore } from 'vuex'
import { SvButton } from 'components'

const SvModal = defineAsyncComponent(() => import('components/organisms/sv-modal/sv-modal.vue'))
const store = useStore()

const props = defineProps<{
  actions: any[]
}>()

const onClick = (action: any) => {
  store.dispatch('meta/fulfillPrompt', action.name)
}
</script>
