<template>
  <c-bare-button
    :class="`
      text-white text-center font-bold
      py-2 px-4
      rounded-md bg-${type||'success'}-500 border-b-2 border-${type}-700
    `"
  >
    <slot></slot>
  </c-bare-button>
</template>

<script setup lang="ts">
import { CBareButton } from '..'

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
