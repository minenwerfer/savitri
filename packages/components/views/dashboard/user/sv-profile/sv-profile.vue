<template>
  <sv-header>Editar perfil</sv-header>
  <div class="flex flex-col xl:flex-row gap-y-6">
    <div class="xl:flex justify-center xl:w-2/5 xl:order-2">
      <div class="hidden xl:block xl:w-3/5 self-start">
        <inline-svg
          :src="require('../../../../assets/svg/browsing.svg').default"
          class="xl:w-11/12"
        ></inline-svg>
      </div>
    </div> 
    <sv-box :key="fields" class="flex-grow">
      <div class="flex flex-col gap-y-6 xl:order-1">
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
      </div>
    </sv-box>
  </div>
</template>

<script setup lang="ts">
import { onMounted, provide, reactive, computed, toRefs } from 'vue'
import { useStore } from 'vuex'
import { default as InlineSvg } from 'vue-inline-svg'
import { useModule } from '../../../../../frontend'
import {
  SvHeader,
  SvBox,
  SvForm,
  SvBareButton,
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
