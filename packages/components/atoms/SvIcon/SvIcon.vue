<template>
  <unicon v-bind="props"></unicon>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string
  fill?: string
}>()
</script>
