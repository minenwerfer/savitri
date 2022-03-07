<template>
  <sv-header>Editar perfil</sv-header>
  <div class="flex flex-col xl:flex-row gap-y-6">
    <div class="xl:flex justify-center xl:w-2/5 xl:order-2">
      <div class="xl:w-1/2">Algum SVG pertinente</div>
    </div>
    <sv-box :key="fields" class="flex-grow xl:order-1">
      <sv-form
        :form="useFieldsExcept(['access', 'password'])"
        :form-data="item"
      ></sv-form>

      <div class="flex gap-x-4">
        <sv-button
          @clicked="insert"
          :disabled="isLoading"
        >
          Salvar
        </sv-button>
        <sv-bare-button
          @clicked="$router.push({ name: 'dashboard-user-changepass' })"
          class="text-blue-500"
        >
          Mudar senha
        </sv-bare-button>
      </div>
    </sv-box>
  </div>
</template>

<script setup lang="ts">
import { onMounted, provide, reactive, computed, toRefs } from 'vue'
import { useStore } from 'vuex'
import useModule from 'frontend/composables/module'
import {
  SvHeader,
  SvBox,
  SvForm,
  SvBareButton,
  SvButton

} from 'frontend/components'

const store = useStore()
const moduleRefs = reactive(useModule('user', store))

provide('module', 'user')

store.commit('user/CURRENT_UPDATE')
const item = computed(() => store.state.user.current)

const insert = async () => {
  await moduleRefs.insert({ what: item._value })
  sessionStorage.setItem('auth:current', JSON.stringify(moduleRefs.item))

  store.dispatch('meta/spawnModal', {
    title: 'Feito!',
    body: 'Suas informações foram salvas'
  })
}

const {
  isLoading,
  fields,
  useFieldsExcept,

} = toRefs(moduleRefs)
</script>
