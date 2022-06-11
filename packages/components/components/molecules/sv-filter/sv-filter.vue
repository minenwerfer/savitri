<template>
  <div :key="filters" class="flex flex-col gap-y-6">
    <sv-form
      :form="availableFilters"
      :form-data="$store.state[module]._filters"
      :flex="true"
      :search-only="true"
    ></sv-form>

    <div class="flex gap-x-2">
      <sv-button variant="light" @clicked="clear">Limpar</sv-button>
      <sv-button
        icon="filter"
        @clicked="filter"
        :disabled="!anyFilters"
      >
        Filtrar
      </sv-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, provide, inject, computed } from 'vue'
import { useStore } from 'vuex'
import { fromEntries } from 'common/helpers'
import { useModule } from '../../../../frontend'
import { SvButton } from '../../'
import { SvForm } from '../index'

const props = defineProps<{
  module: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const store = useStore()
const moduleRefs = reactive(useModule(props.module, store))

const filter = async () => {
  const filters = moduleRefs.filters

  await store.dispatch(`${props.module}/getAll`, {
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

const filters = computed(() => store.state[props.module]._filters)

const anyFilters = computed(() => {
  return Object.values(store.state[props.module]._filters)
    .some((value: any) => !!value)
})

const {
  availableFilters,

} = moduleRefs
</script>
