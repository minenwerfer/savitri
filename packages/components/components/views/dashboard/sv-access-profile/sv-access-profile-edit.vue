<template>
  <sv-box
    title="Editar preset de acesso"
    :float="true"
    @close="$router.back()"
  >
    <div class="flex flex-col gap-y-6">
      <sv-form
        :form="store.fields"
        :form-data="store.item"
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
        :form-data="store.item.capabilities"
        >
      </sv-form>
    </div>
    <template #footer>
      <sv-button
        :disabled="store.isLoading"
        @clicked="insert"
      >
        Salvar
      </sv-button>
    </template>
  </sv-box>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '@savitri/web'
import type { CollectionDescription } from '@savitri/common'
import { SvBox, SvForm, SvButton } from '../../..'
  
const store = useStore('accessProfile')
const metaStore = useStore('meta')
const router = useRouter()

const { capabilities, ...fields } = store.fields

provide('module', 'accessProfile')

type AccParams = Pick<
  CollectionDescription,
  'module'
  | 'report'
  | 'methods'
  | 'extraMethods'
>

const modules = metaStore.globalDescriptions
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

if( !store.item.capabilities ) {
  store.item.capabilities = {}
}

const grantEverything = () => {
  Object.entries(capabilitiesFields)
    .forEach(([key, value]: [string, Array<string>]) => {
      store.item.capabilities[key] = value.values.map((v: { value: string }) => v.value)
    })
}

const insert = async () => {
  await store.dispatch('accessProfile/insert', { payload: { what: store.item.value } })
  router.back()
}
</script>
