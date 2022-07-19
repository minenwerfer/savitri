<template>
  <sv-box class="xl:w-2/5">
    <div class="flex flex-col gap-y-6">
      <sv-form
        :form="fields"
        :form-data="item"
      ></sv-form>

      <sv-button
        @clicked="insert"
        :disabled="(item.password?.length||0) < 4 || item.password !== item.verification"
        class="self-start"
      >
        Salvar
      </sv-button>
    </div>
  </sv-box>
</template>

<script setup lang="ts">
import { provide, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useModule } from '../../../../../../web'
import { SvBox, SvForm, SvButton } from '../../../..'

const store = useStore()
const moduleRefs = reactive(useModule('user', store))

provide('module', 'user')

const fields = {
  password: {
    label: 'Senha',
    type: 'password'
  },
  verification: {
    label: 'Confirme a senha',
    type: 'password'
  }
}

const insert = async () => {
  const { password } = moduleRefs.item
  await moduleRefs.insert({
    what: {
      _id: moduleRefs.item._id,
      password
    }
  })

  store.dispatch('meta/spawnModal', {
    title: 'Feito!',
    body: 'A senha foi atualizada'
  })
}

const {
  item

} = toRefs(moduleRefs)
</script>
