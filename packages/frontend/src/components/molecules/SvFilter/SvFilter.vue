<template>
  <div class="mb-6 md:w-1/2">
    <strong>Filtrar por</strong>
    <sv-form
      :form="availableFilters"
      :form-data="filters"
      :padding-bottom="0"
      >
    </sv-form>
    <div class="flex gap-x-2">
      <sv-button type="neutral" @clicked="clear">Limpar</sv-button>
      <sv-button type="neutral" @clicked="filter">Filtrar</sv-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, inject, } from 'vue'
import { useStore } from 'vuex'
import { SvForm } from '../index'
import { SvButton } from 'frontend/components'

import useModule from 'frontend/composables/module'

const props = defineProps<{
  module: string
}>()

const store = useStore()
const moduleRefs = reactive(useModule(props.module, store))

const clear = () => {
  store.commit(`${props.module}/FILTERS_CLEAR`)
}

const filter = () => {
  store.dispatch(`${props.module}/getAll`, {
    payload: { filter: moduleRefs.filters }
  })
}

const {
  availableFilters,
  filters

} = moduleRefs
</script>
