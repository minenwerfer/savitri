<template>
  <sv-header>Editar perfil</sv-header>
  <sv-box :key="fields" class="flex-grow">
    <sv-form
      :form="useFieldsExcept(['access', 'password'])"
      :form-data="item"
    ></sv-form>

    <template #footer>
      <sv-button
        :disabled="isLoading"
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
import {
  onMounted,
  provide,
  reactive,
  computed,
  toRefs

} from 'vue'

import { useStore } from 'vuex'
import { useModule } from '../../../../../../frontend'
import {
  SvHeader,
  SvBox,
  SvForm,
  SvButton

} from '../../../..'

const store = useStore()
const moduleRefs = reactive(useModule('user', store))

provide('module', 'user')
store.commit('user/CURRENT_UPDATE')

const insert = async () => {
  await moduleRefs.insert({ what: moduleRefs.item })
  sessionStorage.setItem('auth:current', JSON.stringify(moduleRefs.item))

  store.dispatch('meta/spawnModal', {
    title: 'Feito!',
    body: 'Suas informações foram salvas'
  })
}

const {
  isLoading,
  item,
  fields,
  useFieldsExcept,

} = toRefs(moduleRefs)
</script>
