<template>
  <div class="mb-6">
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

<script>
import { reactive, toRefs, inject } from 'vue'
import { useStore } from 'vuex'
import { CForm } from '../index'
import { CButton } from 'frontend/components'

import useModule from 'frontend/composables/module'

export default {
  components: {
    CForm,
    CButton
  },

  props: {
    module: {
      type: String,
      required: true
    }
  },

  methods: {
    clear() {
      this.store.commit(`${this.module}/FILTERS_CLEAR`)
    },
    filter() {
      this.store.dispatch(`${this.module}/getAll`, {
        payload: { filter: this.filters }
      })
    }
  },

  setup(props) {
    const store = useStore()
    const module = reactive(useModule(props.module, store))

    return {
      store,
      ...toRefs(module)
    }
  }
}
</script>
