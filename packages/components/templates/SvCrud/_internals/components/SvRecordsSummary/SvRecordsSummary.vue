<template>
  <div class="flex justify-end">
    <div v-if="recordsCount && recordsTotal" class="text-sm opacity-60">
      {{ recordsCount }} de {{ recordsTotal }} registros
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  recordsCount: number
  recordsTotal: number
}>()
</script>
