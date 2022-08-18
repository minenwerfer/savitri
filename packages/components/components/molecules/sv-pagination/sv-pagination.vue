<template>
  <div class="pagination" @change="paginate">
    <div class="pagination__control">
      <div>Limite</div>
      <sv-select v-model.number="store.pagination.limit">
        <option
          v-for="limit in PAGINATION_PER_PAGE_DEFAULTS"
          :key="`limit-${limit}`"
        >
          {{ limit }}
        </option>
      </sv-select>
    </div>
    <div class="pagination__control">
      <div>Página</div>
      <sv-select v-model.number="page">
        <option
          v-for="page in pageCount"
          :key="`page-${page}`"
        >
          {{ page }}
        </option>
      </sv-select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useParentStore } from '@savitri/web'
import {
  PAGINATION_PER_PAGE_DEFAULT,
  PAGINATION_PER_PAGE_DEFAULTS

} from '@savitri/common'

import { SvSelect } from '../../'

const store = useParentStore()

const page = computed({
  get: () => Math.floor(store.pagination.offset / store.pagination.limit),
  set: (page: number) => {
    store.pagination.offset = (page - 1) * store.pagination.limit
  }
})

const pageCount = computed(() => Math.floor(store.pagination.recordsTotal / store.pagination.limit))

const paginate = () => {
  store.getAll()
}
</script>

<style scoped src="./sv-pagination.scss"></style>
