<template>
  <sv-box :key="userStore.fields" class="profile">
    <sv-form
      v-bind="{
        collection: 'user',
        form: userStore.useProperties([
          'full_name',
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
        variant="transparent"
        @clicked="router.push({ name: 'dashboard-user-changepass' })"
      >
        Mudar senha
      </sv-button>
      <sv-button
        large
        :disabled="userStore.isLoading"
        @clicked="insert"
      >
        Salvar
      </sv-button>
    </template>
  </sv-box>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useStore } from '../../../../../web'
import {
  SvBox,
  SvForm,
  SvButton

} from '../../../../components'

const router = useRouter()
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
