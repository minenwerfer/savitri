<script setup lang="ts">
import { useRouter, useStore } from '@savitri/web'
import SvForm from '../../components/form/sv-form/sv-form.vue'
import SvIcon from '../../components/sv-icon/sv-icon.vue'
import SvButton from '../../components/sv-button/sv-button.vue'

const router = await useRouter()
const userStore = useStore('user')

await useStore('meta').describeAll()
</script>

<template>
  <div>
    <h1>Criar conta</h1>
    <sv-icon
      v-clickable
      name="arrow-left"
      @click="router.push({ name: 'user-signin' })"
    >
      Efetuar login
    </sv-icon>
  </div>

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

  <sv-button @click="router.push({ name: 'user-signup-extra' })">
    Próximo
  </sv-button>
</template>
