<template>
  <sv-header>Editar perfil</sv-header>
  <sv-box :key="store.fields" class="flex-grow">
    <sv-form
      :form="store.useFieldsExcept(['access', 'password'])"
      :form-data="store.item"
    ></sv-form>

    <template #footer>
      <sv-button
        :disabled="store.isLoading"
        @clicked="insert"
      >
        Salvar
      </sv-button>
      <sv-button
        variant="light"
        @clicked="$router.push({ name: 'dashboard-user-changepass' })"
      >
        Mudar senha
      </sv-button>
    </template>
  </sv-box>
</template>

<script setup lang="ts">
import { provide } from 'vue'
import { useStore } from '@savitri/web'
import {
  SvHeader,
  SvBox,
  SvForm,
  SvButton

} from '../../../..'

const store = useStore('user')
const metaStore = useStore('meta')
provide('storeId', 'user')

// store.commit('user/CURRENT_UPDATE')

const insert = async () => {
  await store.insert({ what: store.item })
  sessionStorage.setItem('auth:currentUser', JSON.stringify(store.item))

  metaStore.spawnModal({
    title: 'Feito!',
    body: 'Suas informações foram salvas'
  })
}
</script>
