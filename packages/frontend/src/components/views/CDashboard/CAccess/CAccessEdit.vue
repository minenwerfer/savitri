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

<script setup lang="ts">
import { computed, provide } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { CBox, CForm, CButton } from 'frontend/components'
  
const store = useStore()
const router = useRouter()
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
const capabilitiesFields = modules.reduce((a: any, { module, methods, extraMethods }: { module: string, methods: string[], extraMethods: string[] }) => ({
  ...a,
  [module]: {
    label: module,
    type: 'checkbox',
    values: [...(methods || defaultMethods), ...(extraMethods||[])].map((method: any) => ({
      label: method,
      value: method
    }))
  }
}), {})

const accessItem = store.getters['access/accessItem']
if( !accessItem.capabilities ) {
  accessItem.capabilities = {}
}

const item = computed(() => accessItem)
const isLoading = computed(() => store.state.access.isLoading)

const insert = async () => {
  await store.dispatch('access/insert', { payload: { what: item.value } })
  router.back()
}
</script>
