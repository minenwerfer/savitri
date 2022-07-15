<template>
  <div class="summary">
    <div v-if="recordsCount && recordsTotal" class="text-sm opacity-60">
      Mostrando {{ limit*currentPage }} a {{ limit*currentPage + recordsCount }} de {{ recordsTotal }} registros
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  recordsCount: number
  recordsTotal: number
  currentPage: number
  limit: number
}

const props = defineProps<Props>()

const currentPage = computed(() => (props.currentPage||1) - 1)
</script>

<style scoped src="./sv-records-summary.scss"></style>
