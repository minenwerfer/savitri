<template>
  <div
    v-if="Object.keys(store.availableFilters).length > 0"
    class="filter"
  >
    <div class="filter__count">
      <div>Filtros</div>
      <div>({{ store.filtersCount }})</div>
    </div>
    <div class="filter__icons">
      <sv-bare-button
        @clicked="isFilterVisible = true"
      >
        <sv-icon
          reactive
          name="filter"
        ></sv-icon>
      </sv-bare-button>
      <sv-bare-button
        :disabled="Object.keys(store.availableFilters).length === 0"
        @clicked="store.clearFilters"
      >
        <sv-icon
          reactive
          name="trash"
        ></sv-icon>
      </sv-bare-button>
    </div>
  </div>

  <sv-box
    close-hint
    fixed-right
    v-model:visible="isFilterVisible"
    title="Filtrar por"
    @close="isFilterVisible = false"
    @overlay-click="isFilterVisible = false"
  >
    <sv-form
      v-bind="{
        form: store.availableFilters,
        formData: store.filters,
        searchOnly: true,
        layout: store.formLayout
      }"
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
