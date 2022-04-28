<template>
  <unicon
    v-bind="props"
    :class="animate && 'hover:scale-125'"
  ></unicon>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string
  fill?: string
  animate?: boolean
}>()
</script>
