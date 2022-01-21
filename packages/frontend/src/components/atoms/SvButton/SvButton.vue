<template>
  <sv-bare-button
    :class="`
      text-white text-center font-bold outline-none
      py-1 px-4 rounded-md
      bg-${type||'success'}-500 border-b-2 border-${type}-700
    `"
  >
    <slot></slot>
  </sv-bare-button>
</template>

<script setup lang="ts">
import { SvBareButton } from '..'

const props = defineProps<{
  type?: string
}>()
</script>

<style scoped>
@layer hover {
  .underline {
    text-decoration: none;
  }
}
</style>
