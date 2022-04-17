<template>
  <div :key="$store.state[module]._filters" class="flex flex-col gap-y-6">
    <sv-form
      :form="availableFilters"
      :form-data="$store.state[module]._filters"
      :flex="true"
      :search-only="true"
    ></sv-form>

    <div class="flex gap-x-2">
      <sv-button variant="light" @clicked="clear">Limpar</sv-button>
      <sv-button icon="filter" @clicked="filter">Filtrar</sv-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, provide, inject } from 'vue'
import { useStore } from 'vuex'
import { fromEntries } from 'common/helpers'
import { useModule } from 'frontend/composables'
import { SvButton } from 'frontend/components'
import { SvForm } from '../index'

const props = defineProps<{
  module: string
}>()

const store = useStore()
const moduleRefs = reactive(useModule(props.module, store))

const filter = () => {
  const filters = moduleRefs.filters

  store.dispatch(`${props.module}/getAll`, {
    payload: { 
      filters,
      limit: store.state[props.module]._limit
    }
  })
}

const clear = () => {
  store.commit(`${props.module}/FILTERS_CLEAR`)
  filter()
}

const {
  availableFilters,

} = moduleRefs
</script>
