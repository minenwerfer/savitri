<template>
  <div class="pagination">
    <div class="pagination__control">
      <sv-select v-model="limit" :property="{}">
        <option
          v-for="limit in PAGINATION_PER_PAGE_DEFAULTS"
          :key="`limit-${limit}`"
          :value="limit"
        >
          {{ limit }}
        </option>
      </sv-select>
      <sv-icon
        small
        name="list-ul"
        fill="gray"
      ></sv-icon>
    </div>

    <div class="pagination__control">
      <sv-bare-button @clicked="page = 0">
        <sv-icon
          small
          name="angle-double-left"
        ></sv-icon>
      </sv-bare-button>
      <sv-bare-button
        :disabled="store.isLoading || page === 0"
        @clicked="paginate('previous')"
      >
        <sv-icon
          small
          name="angle-left"
        ></sv-icon>
      </sv-bare-button>
      <div class="pagination__page-input">
        <sv-input
          v-model="pageInput"
          :key="page"
          :property="{
            type: 'number',
            minimum: 1
          }"

          @change="page = pageInput === 0 ? 0 : pageInput - 1"
        ></sv-input>
        <span>{{ $t('of') }} {{ pageCount }}</span>
      </div>
      <sv-bare-button
        :disabled="store.isLoading || page >= pageCount - 1"
        @clicked="paginate('next')"
      >
        <sv-icon
          small
          name="angle-right"
        ></sv-icon>
      </sv-bare-button>
      <sv-bare-button @clicked="page = pageCount - 1">
        <sv-icon
          small
          name="angle-double-right"
        ></sv-icon>
      </sv-bare-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, } from 'vue'
import { PAGINATION_PER_PAGE_DEFAULTS } from '@semantic-api/types'
import { useParentStore } from '../../../web'

import {
  SvBareButton,
  SvSelect,
  SvInput,
  SvIcon
} from '..'

type Props = {
  collection: string
}

const props = defineProps<Props>()
const store = useParentStore(props.collection)

const page = computed({
  get: () => Math.floor(store.pagination.offset / store.pagination.limit),
  set: (page: number) => {
    store.pagination.offset = page * store.pagination.limit
  }
})

const limit = computed({
  get: () => String(store.pagination.limit),
  set: (value) => {
    store.pagination.limit = Number(value)
  }
})

const pageInput = ref(page.value ? page.value + 1 : 1)
const pageCount = computed(
  () => Math.ceil(store.pagination.recordsTotal / store.pagination.limit)
)

const paginate = (direction: 'previous'|'next') => {
  window.scrollTo(0, 0)
  page.value = direction === 'previous'
    ? page.value - 1
    : page.value + 1
}

watch(() => page.value, (newVal: number) => {
  pageInput.value = newVal + 1
  store.filter({
    project: [
      ...Object.keys(store.properties),
      ...store.tableMeta
    ]
  })
})
</script>

<style scoped src="./sv-pagination.scss"></style>
