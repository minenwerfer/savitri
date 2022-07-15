<template>
  <div class="filter">
    <div class="filter__count">
      <div>Filtros</div>
      <div>({{ filtersCount }})</div>
    </div>
    <div class="filter__icons">
      <sv-bare-button
        type="neutral"
        :disabled="Object.keys(availableFilters).length === 0"
        @clicked="isFilterVisible = true"
      >
        <sv-icon name="filter" :reactive="true"></sv-icon>
      </sv-bare-button>
      <sv-bare-button
        type="neutral"
        :disabled="Object.keys(availableFilters).length === 0"
        @clicked="filterClear"
      >
        <sv-icon name="trash" :reactive="true"></sv-icon>
      </sv-bare-button>
    </div>
  </div>

  <sv-box
    @close="isFilterVisible = false"
    v-model:visible="isFilterVisible"
    v-bind="{
      title: 'Filtrar por',
      float: true
    }"
  >
    <sv-form
      :form="availableFilters"
      :form-data="store.state[module]._filters"
      :flex="true"
      :search-only="true"
    ></sv-form>
    <template #footer>
      <sv-button
        variant="light"
        @clicked="filterClear"
      >
        Limpar
      </sv-button>
      <sv-button
        icon="filter"
        :disabled="!anyFilters"
        @clicked="filter"
      >
        Filtrar
      </sv-button>
    </template>
  </sv-box>
</template>

<script setup lang="ts">
import { reactive, computed, ref, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useModule } from '../../../../../../../frontend'
import { fromEntries } from '../../../../../../../common/helpers'
import {
  SvBox,
  SvBareButton,
  SvButton,
  SvForm,
  SvIcon

} from '../../../../..'

interface Props {
  module: string
  availableFilters: any
  filters: any
}

const props = defineProps<Props>()
const store = useStore()

const filterPanel = ref(null)
const isFilterVisible = ref(false)

const moduleRefs = reactive(useModule(props.module, store))

const filters = computed(() => store.state[props.module]._filters)
const filtersCount = computed(() => {
  return Object.values(props.filters)
    .filter((_: any) => !!_)
    .length
})

const anyFilters = computed(() => {
  return Object.values(store.state[props.module]._filters)
    .some((value: any) => !!value)
})

const {
  filter,
  filterClear,

} = toRefs(moduleRefs)
</script>

<style scoped src="./sv-filter-widget.scss"></style>
