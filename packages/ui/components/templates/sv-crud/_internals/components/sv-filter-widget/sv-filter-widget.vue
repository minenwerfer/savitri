<template>
  <div
    v-if="Object.keys(store.availableFilters).length > 0"
    class="filter"
  >
    <div class="filter__icons">
      <sv-bare-button
        @clicked="isFilterVisible = true"
      >
        <sv-icon
          alt
          reactive
          name="filter"
        ></sv-icon>
      </sv-bare-button>
      <sv-bare-button
        :disabled="Object.keys(store.$filters).length === 0"
        @clicked="store.clearFilters"
      >
        <sv-icon
          alt
          reactive
          name="trash"
        ></sv-icon>
      </sv-bare-button>
    </div>

    <sv-filter-bubbles></sv-filter-bubbles>
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
        @clicked="filter"
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

import SvFilterBubbles from '../sv-filter-bubbles/sv-filter-bubbles.vue'

const store = useParentStore()
const isFilterVisible = ref(false)

const filter = () => {
  store.pagination.offset = 0
  store.filter()
}
</script>

<style scoped src="./sv-filter-widget.scss"></style>
