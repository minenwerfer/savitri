<template>
  <sv-icon
    v-clickable
    name="arrow-left"
    @click="router.push({ name: 'user-signin' })"
  >
    Efetuar login
  </sv-icon>

  <sv-form
    v-bind="{
      collection: 'user',
      formData: userStore.item,
      form: userStore.useProperties([
        'full_name',
        'email',
        'phone'
      ])
    }"
  ></sv-form>

  <sv-button @clicked="router.push({ name: 'user-signup-extra' })">
    Próximo
  </sv-button>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useStore } from '../../../web'
import { SvForm, SvIcon, SvButton } from '../..'

const router = useRouter()
const userStore = useStore('user')
</script>
