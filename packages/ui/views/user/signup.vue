<template>
  <sv-icon
    v-clickable
    name="arrow-left"
    @click="$router.push({ name: 'user-signin' })"
  >
    Efetuar login
  </sv-icon>

  <sv-form
    v-bind="{
      formData: userStore.item,
      form: userStore.useProperties([
        'first_name',
        'last_name',
        'email',
        'phone'
      ])
    }"
  ></sv-form>

  <sv-button @clicked="$router.push({ name: 'user-signup-extra' })">
    Próximo
  </sv-button>
</template>

<script setup lang="ts">
import { useParentStore } from '../../../web'
import { SvForm, SvIcon, SvButton } from '../..'

const userStore = useParentStore()
</script>
