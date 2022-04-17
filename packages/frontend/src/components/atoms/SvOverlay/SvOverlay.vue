<template>
  <div :class="`fixed inset-0 z-50 cursor-pointer ${invisible || 'bg-gray-900 opacity-0 transform-gpu animate-overlay'}`"></div>
</template>

<script setup lang="ts">
const props = defineProps<{
  invisible?: boolean
}>()
</script>
