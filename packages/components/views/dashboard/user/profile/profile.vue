<template>
  <strong>Editar perfil</strong>
  <sv-box :key="userStore.fields" class="profile">
    <sv-form
      v-bind="{
        collection: 'user',
        form: userStore.useFields([
          'first_name',
          'last_name',
          'email',
          'phone',
          'picture'
        ]),
        formData: userStore.item,
        layout: userStore.formLayout
      }"
    ></sv-form>

    <template #footer>
      <sv-button
        :disabled="userStore.isLoading"
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

const userStore = useStore('user')
const metaStore = useStore('meta')

userStore.setItem(userStore.$currentUser)

const insert = async () => {
  await userStore.insert({ what: userStore.item })
  sessionStorage.setItem('auth:currentUser', JSON.stringify(userStore.item))

  metaStore.spawnModal({
    title: 'Feito!',
    body: 'Suas informações foram salvas'
  })
}
</script>

<style scoped src="./profile.scss"></style>
