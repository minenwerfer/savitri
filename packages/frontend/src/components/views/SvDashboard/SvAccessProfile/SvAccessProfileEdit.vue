<template>
  <sv-box title="Editar preset de acesso" :float="true" @close="$router.back()">
    <template #body>
      <sv-form
        :form="fields"
        :form-data="item"
      >
      </sv-form>
      <sv-form
        :form="capabilitiesFields"
        :form-data="item.capabilities"
        >
      </sv-form>
    </template>
    <template #footer>
      <sv-button
        :disabled="isLoading"
        @clicked="insert"
      >
        Salvar
      </sv-button>
    </template>
  </sv-box>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { SvBox, SvForm, SvButton } from 'frontend/components'
  
const store = useStore()
const router = useRouter()
const { capabilities, ...fields } = store.getters['accessProfile/fields']

provide('module', 'accessProfile')

const defaultMethods = [
  'get',
  'getAll',
  'remove',
  'removeAll',
  'insert',
  'modify',
  'modifyAll'
]

const modules = store.state.meta.globalDescriptions
const capabilitiesFields = modules.reduce((a: any, { module, methods, extraMethods }: { module: string, methods: string[], extraMethods: string[] }) => ({
  ...a,
  [module]: {
    label: module,
    type: 'checkbox',
    translate: true,
    values: [...(methods || defaultMethods), ...(extraMethods||[])].map((method: any) => ({
      label: method,
      value: method
    }))
  }
}), {})

const accessItem = store.getters['accessProfile/item']
if( !accessItem.capabilities ) {
  accessItem.capabilities = {}
}

const item = computed(() => accessItem)
const isLoading = computed(() => store.state.accessProfile.isLoading)

const insert = async () => {
  await store.dispatch('accessProfile/insert', { payload: { what: item.value } })
  router.back()
}
</script>
