<template>
  <div class="signin">
    <div v-html="webpackVariables.signinText || 'Identifique-se'"></div>
    <sv-form
      :form-data="userStore.credentials"
      :form="{
        email: {
          placeholder: 'E-mail',
          icon: 'user',
          type: 'text',
          required: true,
        },
        password: {
          placeholder: 'Senha',
          icon: 'key-skeleton',
          type: 'password',
          required: true,
        }
      }"
    ></sv-form>

    <div class="signin__buttons">
      <sv-button
        :disabled="userStore.isLoading"
        @clicked="authenticate"
      >
        Entrar
      </sv-button>

      <sv-button
        v-if="userStore.$currentUser._id && !metaStore.isLoading"
        :disabled="userStore.isLoading || metaStore.isLoading"
        @clicked="router.push({ name: 'dashboard-home' })"
      >
        Continuar como {{ userStore.$currentUser.first_name }}
      </sv-button>
    </div>

    <div
      v-if="webpackVariables.signupForm"
      v-clickable
      class="signin__action"
      @click="router.push({ name: 'user-signup' })"
    >
      Não possui uma conta?
    </div>
  </div>
</template>

<script setup lang="ts">
import { provide } from 'vue'
import { useRouter } from 'vue-router'
import { useStore, useParentStore } from '@savitri/web'
import { default as webpackVariables } from 'variables'
import { SvForm, SvButton } from '../../..'

const router = useRouter()
const userStore = useParentStore()
const metaStore = useStore('meta')

provide('inputVariant', 'bold')

const authenticate = async () => {
  await userStore.authenticate(userStore.credentials)
  router.push({ name: 'dashboard-home' })
}

</script>

<style scoped src="./signin.scss"></style>
