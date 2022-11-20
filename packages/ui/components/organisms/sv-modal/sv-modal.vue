<template>
  <sv-box
    float
    v-bind="props"
    @close="metaStore.modal.isVisible = false"
  >
    <slot name="body" v-if="$slots.body"></slot>
    <slot v-else></slot>
    <template #footer v-if="$slots.footer">
      <slot name="footer"></slot>
    </template>
  </sv-box>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { useStore } from '../../../../web'

const SvBox = defineAsyncComponent(() => import('../../molecules/sv-box/sv-box.vue'))
const metaStore = useStore('meta')

const props = withDefaults(
  defineProps<{ closeHint?: boolean }>(),
  { closeHint: true }
)
</script>
