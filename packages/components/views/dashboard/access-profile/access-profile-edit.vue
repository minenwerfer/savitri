<template>
  <sv-box
    title="Editar preset de acesso"
    :float="true"
    @close="$router.back()"
  >
    <div class="access">
      <sv-form
        :form="fields"
        :form-data="store.item"
        :key="fields.role.values"
      >
      </sv-form>
      <sv-button
        variant="light"
        @clicked="grantEverything"
      >
        Marcar tudo
      </sv-button>
      <sv-form
        :form="capabilitiesFields"
        :form-data="store.item.capabilities"
        :collection="accessProfile"
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
import { reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '@savitri/web'
import type { CollectionDescription } from '@savitri/common'
import { SvBox, SvForm, SvButton } from '../../..'
  
const store = useStore('accessProfile')
const metaStore = useStore('meta')
const router = useRouter()

const { capabilities, ...fieldsRest } = store.fields
const fields = reactive(fieldsRest)

type AccParams = Pick<
  CollectionDescription,
  'collection'
  | 'report'
  | 'methods'
  | 'extraMethods'
>

onMounted(async () => {
  const { result: roles } = await store.custom('roles')
  fields.role.values = roles.reduce((a: any, role: string) => ({
    ...a,
    [role]: {
      value: role,
      label: role
    }
  }), {})
})

const capabilitiesFields = Object.values(metaStore.descriptions).reduce(
  (a: any, { collection: collectionName, report, methods, extraMethods }: AccParams
) => {
  if( !methods && !extraMethods ) {
    return a
  }

  return {
    ...a,
    [collectionName]: {
      label: collectionName,
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
  await store.insert({ what: store.item.value })
  router.back()
}
</script>

<style scoped src="./access-profile-edit.scss"></style>
