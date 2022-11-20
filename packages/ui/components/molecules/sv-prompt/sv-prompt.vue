<template>
  <sv-modal :close-hint="false">
    <slot v-if="$slots.body" name="body"></slot>
    <slot v-else></slot>

    <template #title v-if="title">
      {{ title }}
    </template>

    <template #footer>
      <sv-button
        v-for="(action, index) in actions"
        v-bind="action"
        :key="`action-${index}`"

        @clicked="onClick(action)"
      >
        {{ action.title }}
      </sv-button>
    </template>
  </sv-modal>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { useStore } from '../../../../web'
import { SvButton } from '../../'

const SvModal = defineAsyncComponent(() => import('../../organisms/sv-modal/sv-modal.vue'))
const metaStore = useStore('meta')

type Props = {
  title?: string
  actions: Array<any>
}

const props = defineProps<Props>()

const onClick = (answer: any) => {
  metaStore.fulfillPrompt(answer)
}
</script>
