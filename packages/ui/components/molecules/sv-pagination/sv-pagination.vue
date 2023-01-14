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
        name="list-ul"
        fill="gray"
      ></sv-icon>
    </div>

    <div class="pagination__control">
      <sv-button
        small
        icon="angle-left"
        :disabled="store.isLoading || page === 0"
        @clicked="page -= 1"
      ></sv-button>

      <div class="pagination__page-input">
        <sv-input
          v-model="pageInput"
          :key="page"
          :property="{
            type: 'number',
            minimum: 1
          }"

          @change="page = pageInput"
        ></sv-input>
      </div>
      <div>
        / {{ pageCount + 1 }}
      </div>

      <sv-button
        small
        icon="angle-right"
        :disabled="store.isLoading || page === pageCount"
        @clicked="page += 1"
      ></sv-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, } from 'vue'
import { PAGINATION_PER_PAGE_DEFAULTS } from '@semantic-api/types'
import { useParentStore } from '../../../../web'

import {
  SvButton,
  SvSelect,
  SvInput,
  SvIcon
} from '../../'

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
  () => Math.floor(store.pagination.recordsTotal / store.pagination.limit)
)

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
