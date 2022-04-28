<template>
  <div class="flex justify-end text-right">
    <div v-if="recordsCount && recordsTotal" class="text-sm opacity-60">
      Mostrando {{ limit*currentPage }} a {{ limit*currentPage + recordsCount }} de {{ recordsTotal }} registros
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  recordsCount: number
  recordsTotal: number
  currentPage: number
  limit: number
}>()

const currentPage = computed(() => (props.currentPage||1) - 1)
</script>
