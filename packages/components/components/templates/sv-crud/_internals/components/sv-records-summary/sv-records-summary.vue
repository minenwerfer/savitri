<template>
  <div class="summary">
    <div v-if="pagination">
      Mostrando
      {{ pagination.limit*currentPage }} a
      {{ pagination.limit*currentPage + pagination.recordsCount }} de
      {{ pagination.recordsTotal }} registros
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useParentStore } from '@savitri/web'

const store = useParentStore()
const pagination = computed(() => store.pagination)
const currentPage = computed(() => (store.pagination.currentPage||1) - 1)
</script>

<style scoped src="./sv-records-summary.scss"></style>
