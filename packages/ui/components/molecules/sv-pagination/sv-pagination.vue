<template>
  <div class="pagination">
    <div class="pagination__control">
      <sv-select v-model="limit">
        <option
          v-for="limit in PAGINATION_PER_PAGE_DEFAULTS"
          :key="`limit-${limit}`"
          :value="limit"
        >
          {{ limit }}
        </option>
      </sv-select>
      <div>por página</div>
    </div>

    <div class="pagination__control">
      <sv-button
        size="small"
        icon="angle-left"
        :disabled="store.isLoading || page === 0"
        @clicked="page -= 1"
      ></sv-button>

      <sv-input
        v-model="pageInput"
        type="number"
        :key="page"
        :min="1"
        class="pagination__page-input"
        @change="page = pageInput"
      ></sv-input>
      <div>
        de {{ pageCount + 1 }}
      </div>

      <sv-button
        size="small"
        icon="angle-right"
        :disabled="store.isLoading || page === pageCount"
        @clicked="page += 1"
      ></sv-button>
    </div>

    <!-- <div class="pagination__control"> -->
    <!--   <div>Página</div> -->
    <!--   <sv-select v-model.number="page"> -->
    <!--     <option -->
    <!--       v-for="page in pageCount" -->
    <!--       :key="`page-${page}`" -->
    <!--     > -->
    <!--       {{ page }} -->
    <!--     </option> -->
    <!--   </sv-select> -->
    <!-- </div> -->
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  defineAsyncComponent

} from 'vue'

import { useParentStore } from '@savitri/web'
import {
  PAGINATION_PER_PAGE_DEFAULT,
  PAGINATION_PER_PAGE_DEFAULTS

} from '@savitri/common'

import {
  SvButton,
  SvSelect,
  SvInput
} from '../../'

const store = useParentStore()

const page = computed({
  get: () => Math.floor(store.pagination.offset / store.pagination.limit),
  set: (page: number) => {
    store.pagination.offset = page * store.pagination.limit
  }
})

const limit = computed({
  get: () => String(store.pagination.limit),
  set: (value: number) => {
    store.pagination.limit = Number(value)
  }
})

const pageInput = ref(page.value ? page.value + 1 : 1)
const pageCount = computed(
  () => Math.floor(store.pagination.recordsTotal / store.pagination.limit)
)

watch(() => page.value, (newVal: number) => {
  pageInput.value = newVal + 1
  store.filter()
})
</script>

<style scoped src="./sv-pagination.scss"></style>
