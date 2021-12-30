<template>
  <div class="mb-6 md:w-1/2">
    <strong>Filtrar por</strong>
    <c-form
      :form="availableFilters"
      :form-data="filters"
      :padding-bottom="0"
      >
    </c-form>
    <div class="flex gap-x-2">
      <c-button type="neutral" @clicked="clear">Limpar</c-button>
      <c-button type="neutral" @clicked="filter">Filtrar</c-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, inject, } from 'vue'
import { useStore } from 'vuex'
import { CForm } from '../index'
import { CButton } from 'frontend/components'

import useModule from 'frontend/composables/module'

const props = defineProps<{
  module: string
}>()

const store = useStore()
const module = reactive(useModule(props.module, store))

const clear = () => {
  store.commit(`${props.module}/FILTERS_CLEAR`)
}

const filter = () => {
  store.dispatch(`${props.module}/getAll`, {
    payload: { filter: module.filters }
  })
}
</script>
