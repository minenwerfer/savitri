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

        @click="onClick(action)"
      >
        {{ action.title }}
      </sv-button>
    </template>
  </sv-modal>
</template>

<script setup lang="ts">
import { useStore } from '@savitri/web'
import SvModal from '../sv-modal/sv-modal.vue'
import SvButton from '../sv-button/sv-button.vue'


type Props = {
  title?: string
  actions: Array<any>
}

const props = defineProps<Props>()
const metaStore = useStore('meta')

const onClick = (answer: any) => {
  metaStore.fulfillPrompt(answer)
}
</script>
