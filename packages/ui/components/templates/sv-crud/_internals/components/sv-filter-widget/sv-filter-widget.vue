<template>
  <sv-box
    close-hint
    fixed-right
    title="Filtrar por"

    @close="$emit('update:visible', false)"
    @overlay-click="$emit('update:visible', false)"
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
        variant="transparent"
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
import { useParentStore } from '../../../../../../../web'
import { SvBox, SvButton, SvForm, } from '../../../../..'

const store = useParentStore()

const filter = () => {
  store.pagination.offset = 0
  store.filter()
}
</script>

<style scoped src="./sv-filter-widget.scss"></style>
