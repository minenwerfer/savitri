<template>
  <div>
    <sv-form
      :form="availableFilters"
      :form-data="$store.state[module]._filters"
      :padding-bottom="0"

      :flex="true"
      :gap-x="4"

      @change="filter"
      class="mb-6"
      >
    </sv-form>

    <sv-bare-button type="neutral" @clicked="clear" class="opacity-60">Limpar</sv-bare-button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, provide, inject } from 'vue'
import { useStore } from 'vuex'
import { SvForm } from '../index'
import { SvBareButton } from 'frontend/components'
import { fromEntries } from 'common/helpers'

import useModule from 'frontend/composables/module'

const props = defineProps<{
  module: string
}>()

const store = useStore()
const moduleRefs = reactive(useModule(props.module, store))

provide('searchOnly', true)

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

onMounted(() => store.commit(`${props.module}/FILTERS_CLEAR`))

const {
  availableFilters,

} = moduleRefs
</script>
