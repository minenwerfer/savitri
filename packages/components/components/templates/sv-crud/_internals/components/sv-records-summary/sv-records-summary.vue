<template>
  <div class="summary">
    <div v-if="pagination">
      Mostrando
      {{ pagination.offset }} a
      {{ pagination.offset + pagination.recordsCount }} de
      {{ pagination.recordsTotal }} registros
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useParentStore } from '@savitri/web'

const store = useParentStore()
const pagination = computed(() => store.pagination)
</script>

<style scoped src="./sv-records-summary.scss"></style>
