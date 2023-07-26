<script setup lang="ts">
import { useParentStore } from '@savitri/web'
import SvBox from '../../../../sv-box/sv-box.vue'
import SvForm from '../../../../form/sv-form/sv-form.vue'
import SvButton from '../../../../sv-button/sv-button.vue'

type Emits = {
  (e: 'update:modelValue', value: boolean): void
}

const emit = defineEmits<Emits>()
const store = useParentStore()

const filter = () => {
  store.pagination.offset = 0
  store.filter()
  emit('update:modelValue', false)
}
</script>

<template>
  <sv-box
    close-hint
    fixed-right
    title="Filtrar por"

    @close="emit('update:modelValue', false)"
    @overlay-click="emit('update:modelValue', false)"
  >
    <sv-form
      v-model="store.filters"
      v-bind="{
        form: store.availableFilters,
        searchOnly: true,
        layout: store.formLayout
      }"
    ></sv-form>
    <template #footer>
      <sv-button
        variant="transparent"
        @click="store.clearFilters"
      >
        Limpar
      </sv-button>
      <sv-button
        icon="filter"
        :disabled="!store.hasActiveFilters"
        @click="filter"
      >
        Filtrar
      </sv-button>
    </template>
  </sv-box>
</template>

<style scoped src="./sv-filter-panel.scss"></style>
