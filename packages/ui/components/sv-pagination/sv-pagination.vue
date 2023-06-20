<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { PAGINATION_PER_PAGE_DEFAULTS } from '@semantic-api/types'
import { useParentStore } from '@savitri/web'

import SvBareButton from '../sv-bare-button/sv-bare-button.vue'
import SvIcon from '../sv-icon/sv-icon.vue'
import SvInput from '../form/sv-input/sv-input.vue'
import SvSelect from '../form/sv-select/sv-select.vue'

type Props = {
  collection: string
}

const props = defineProps<Props>()
const store = useParentStore(props.collection)

const page = computed<number>({
  get: () => Math.floor(store.pagination.offset / store.pagination.limit),
  set: (page: number) => {
    store.pagination.offset = page * store.pagination.limit
  }
})

const limit = computed<number>({
  get: () => store.pagination.limit,
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

const update = () => {
  return store.filter({
    project: [
      ...Object.keys(store.properties),
      ...store.tableMeta
    ]
  })
}

watch([page, limit], ([newPage, newLimit]: [number, number]) => {
  pageInput.value = newPage + 1
  update()
  
})
</script>

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
        style="margin-left: .8rem"
      ></sv-icon>
    </div>

    <div class="pagination__control">
      <sv-bare-button @click="page = 0">
        <sv-icon
          reactive
          name="angle-double-left"
        ></sv-icon>
      </sv-bare-button>
      <sv-bare-button
        :disabled="store.loading.getAll || page === 0"
        @click="paginate('previous')"
      >
        <sv-icon
          reactive
          name="angle-left"
        ></sv-icon>
      </sv-bare-button>
      <div class="pagination__page-input">
        <sv-input
          bordered
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
        :disabled="store.loading.getAll || page >= pageCount - 1"
        @click="paginate('next')"
      >
        <sv-icon
          reactive
          name="angle-right"
        ></sv-icon>
      </sv-bare-button>
      <sv-bare-button @click="page = pageCount - 1">
        <sv-icon
          reactive
          name="angle-double-right"
        ></sv-icon>
      </sv-bare-button>
    </div>
  </div>
</template>

<style scoped src="./sv-pagination.scss"></style>
