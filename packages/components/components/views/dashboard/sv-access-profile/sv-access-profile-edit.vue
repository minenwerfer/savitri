<template>
  <sv-box title="Editar preset de acesso" :float="true" @close="$router.back()">
    <div class="flex flex-col gap-y-6">
      <sv-form
        :form="fields"
        :form-data="item"
      >
      </sv-form>
      <sv-button
        @clicked="grantEverything"
        variant="light"
        class="self-start"
      >
        Marcar tudo
      </sv-button>
      <sv-form
        :form="capabilitiesFields"
        :form-data="item.capabilities"
        >
      </sv-form>
    </div>
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
import type { CollectionDescription } from '@savitri/common'
import { SvBox, SvForm, SvButton } from '../../..'
  
const store = useStore()
const router = useRouter()
const { capabilities, ...fields } = store.getters['accessProfile/fields']

provide('module', 'accessProfile')

type AccParams = Pick<
  CollectionDescription,
  'module'
  | 'report'
  | 'methods'
  | 'extraMethods'
>

const modules = store.state.meta.globalDescriptions
const capabilitiesFields = modules.reduce(
  (a: any, { module: moduleName, report, methods, extraMethods }: AccParams
) => {
  if( !methods ) {
    return a
  }

  return {
    ...a,
    [moduleName]: {
      label: moduleName,
      type: 'checkbox',
      translate: true,
      values: [
        ...(methods||[]),
        ...(extraMethods||[]),
        ...(report ? ['report'] : [])
      ].map((method: any) => ({
        label: method,
        value: method,
      }))
    }
  }
}, {})

const accessItem = store.getters['accessProfile/item']
if( !accessItem.capabilities ) {
  accessItem.capabilities = {}
}

const item = computed(() => accessItem)
const isLoading = computed(() => store.state.accessProfile.isLoading)

const grantEverything = () => {
  Object.entries(capabilitiesFields)
    .forEach(([key, value]: [string, Array<string>]) => {
      accessItem.capabilities[key] = value.values.map((v: { value: string }) => v.value)
    })
}

const insert = async () => {
  await store.dispatch('accessProfile/insert', { payload: { what: item.value } })
  router.back()
}
</script>
