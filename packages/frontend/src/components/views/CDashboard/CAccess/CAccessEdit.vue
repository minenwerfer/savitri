<template>
  <c-box title="Editar preset de acesso" :float="true" @close="$router.back()">
    <template #body>
      <c-form
        :form="fields"
        :form-data="item"
      >
      </c-form>
      <c-form
        :form="capabilitiesFields"
        :form-data="item.capabilities"
        >
      </c-form>
    </template>
    <template #footer>
      <c-button
        :disabled="isLoading"
        @clicked="insert"
      >
        Salvar
      </c-button>
    </template>
  </c-box>
</template>

<script>
import { computed, provide } from 'vue'
import { useStore } from 'vuex'
import { CBox, CForm, CButton } from 'frontend/components'

export default {
  components: {
    CBox,
    CForm,
    CButton
  },

  methods: {
    async insert() {
      await this.store.dispatch('access/insert', { payload: { what: this.item } })
      this.$router.back()
    }
  },
  
  setup() {
    const store = useStore()
    const { capabilities, ...fields } = store.getters['access/fields']

    provide('module', 'access')

    const defaultMethods = [
      'get',
      'getAll',
      'remove',
      'removeAll',
      'insert',
      'modifyAll'
    ]

    const modules = store.state.meta.globalDescriptions
    const capabilitiesFields = modules.reduce((a, { module, methods, extraMethods }) => ({
      ...a,
      [module]: {
        label: module,
        type: 'checkbox',
        values: [...(methods || defaultMethods), ...(extraMethods||[])].map((method) => ({
          label: method,
          value: method
        }))
      }
    }), {})

    const item = store.getters['access/item']
    if( !item.capabilities ) {
      item.capabilities = {}
    }

    return {
      store,
      fields,
      capabilitiesFields,
      item: computed(() => item),
      isLoading: computed(() => store.state.access.isLoading)
    }
  }
}
</script>
