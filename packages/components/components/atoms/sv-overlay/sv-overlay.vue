<template>
  <div :class="`overlay fixed inset-0 cursor-pointer ${invisible || 'bg-gray-900 opacity-0 transform-gpu animate-overlay'}`"></div>
</template>

<script setup lang="ts">
const props = defineProps<{
  invisible?: boolean
}>()
</script>

<style scoped src="./sv-overlay.scss"></style>
