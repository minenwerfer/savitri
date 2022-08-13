<template>
  <sv-box
    float
    close-hint
    @close="metaStore.modal.isVisible = false"
  >
    <template #title>
      <slot name="title"></slot>
    </template>
    <template #body>
      <div class="whitespace-pre-wrap">
        <slot name="body"></slot>
      </div>
    </template>
    <template #footer v-if="$slots.footer">
      <slot name="footer"></slot>
    </template>
  </sv-box>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { useStore } from '@savitri/web'

const SvBox = defineAsyncComponent(() => import('../../molecules/sv-box/sv-box.vue'))
const metaStore = useStore('meta')
</script>
