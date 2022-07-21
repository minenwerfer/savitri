<template>
  <div class="filter">
    <div class="filter__count">
      <div>Filtros</div>
      <div>({{ store.filtersCount }})</div>
    </div>
    <div class="filter__icons">
      <sv-bare-button
        type="neutral"
        :disabled="Object.keys(store.availableFilters).length === 0"
        @clicked="isFilterVisible = true"
      >
        <sv-icon name="filter" :reactive="true"></sv-icon>
      </sv-bare-button>
      <sv-bare-button
        type="neutral"
        :disabled="Object.keys(store.availableFilters).length === 0"
        @clicked="store.clearFilters"
      >
        <sv-icon name="trash" :reactive="true"></sv-icon>
      </sv-bare-button>
    </div>
  </div>

  <sv-box
    v-model:visible="isFilterVisible"
    v-bind="{
      title: 'Filtrar por',
      float: true
    }"
    @close="isFilterVisible = false"
  >
    <sv-form
      :form="store.availableFilters"
      :form-data="store.filters"
      :flex="true"
      :search-only="true"
    ></sv-form>
    <template #footer>
      <sv-button
        variant="light"
        @clicked="store.clearFilters"
      >
        Limpar
      </sv-button>
      <sv-button
        icon="filter"
        :disabled="!store.hasActiveFilters"
        @clicked="store.filter"
      >
        Filtrar
      </sv-button>
    </template>
  </sv-box>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useParentStore } from '../../../../../../../web'
import {
  SvBox,
  SvBareButton,
  SvButton,
  SvForm,
  SvIcon

} from '../../../../..'

const store = useParentStore()
const isFilterVisible = ref(false)
</script>

<style scoped src="./sv-filter-widget.scss"></style>
