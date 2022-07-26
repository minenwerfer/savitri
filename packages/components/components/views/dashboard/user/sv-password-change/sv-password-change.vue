<template>
  <sv-box class="xl:w-2/5">
    <div class="flex flex-col gap-y-6">
      <sv-form
        :form="store.fields"
        :form-data="store.item"
      ></sv-form>

      <sv-button
        class="self-start"
        :disabled="(store.item.password?.length||0) < 4 || store.item.password !== store.item.verification"
        @clicked="insert"
      >
        Salvar
      </sv-button>
    </div>
  </sv-box>
</template>

<script setup lang="ts">
import { provide, reactive, toRefs } from 'vue'
import { useStore } from '@savitri/web'
import { SvBox, SvForm, SvButton } from '../../../..'

const store = useStore('user')
const metaStore = useStore('meta')
provide('storeId', 'user')

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
  const { password } = store.item
  await store.insert({
    what: {
      _id: store.item._id,
      password
    }
  })

  metaStore.spawnModal({
    title: 'Feito!',
    body: 'A senha foi atualizada'
  })
}
</script>
