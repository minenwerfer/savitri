<template>
  <sv-form
    :form="availableFilters"
    :form-data="filters"
    :padding-bottom="0"

    :flex="true"
    :gap-x="4"

    @change="filter"
    class="mb-6"
    >
  </sv-form>
  <div class="flex gap-x-2 opacity-60">
    <sv-bare-button type="neutral" @clicked="clear">Limpar</sv-bare-button>
    <!-- <sv-bare-button type="neutral" @clicked="filter">Filtrar</sv-bare-button> -->
  </div>
</template>

<script setup lang="ts">
import { reactive, inject, } from 'vue'
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

const filter = () => {
  const expr = (key: string, value: any) => {
    const field = store.state[props.module].__description.fields[key]

    if( field.type === 'text' ) {
      return {
        $regex: value,
        $options: 'i'
      }
    }

    const values = Array.isArray(field.values) ? field.values[0] : field.values
    const query = values?.__query

    if( query?.module ) {
      return { _id: value }
    }

    return value
  }

  const entries = Object.entries(moduleRefs.filters)
    .filter(([key, value]: [string, any]) => value && !(typeof value === 'string' &&  value.length === 0))
    .map(([key, value]) => [key, expr(key, value)])

  const filters = fromEntries(entries)

  store.dispatch(`${props.module}/getAll`, {
    payload: { filter: filters }
  })
}

const clear = () => {
  store.commit(`${props.module}/FILTERS_CLEAR`)
  filter()
}

const {
  availableFilters,
  filters

} = moduleRefs
</script>
