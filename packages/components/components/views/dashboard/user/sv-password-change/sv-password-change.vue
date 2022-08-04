<template>
  <div>Mudando a senha de {{ store.item.name }}</div>
  <sv-box class="passchange">
    <div class="passchange__content">
      <sv-form
        :form="fields"
        :form-data="store.item"
      ></sv-form>

      <sv-button
        class="passchange__save-button"
        :disabled="(store.item.password?.length||0) < 4 || store.item.password !== store.item.verification"
        @clicked="insert"
      >
        Salvar
      </sv-button>
    </div>
  </sv-box>
</template>

<script setup lang="ts">
import { useStore } from '@savitri/web'
import { SvBox, SvForm, SvButton } from '../../../..'

const store = useStore('user')
const metaStore = useStore('meta')

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

<style scoped src="./sv-password-change.scss"></style>
