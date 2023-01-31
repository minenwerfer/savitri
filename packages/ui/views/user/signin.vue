<template>
  <h1
    v-if="instanceVars.signinText"
    v-html="instanceVars.signinText"
  ></h1>
  <sv-form
    :form-data="userStore.credentials"
    :form="{
      email: {
        type: 'string',
        s$placeholder: 'E-mail',
        s$icon: 'user',
        s$inputType: 'email',
        s$noLabel: true
      },
      password: {
        type: 'string',
        s$placeholder: 'Senha',
        s$icon: 'key-skeleton',
        s$inputType: 'password',
        s$noLabel: true
      }
    }"
  ></sv-form>

  <div style="
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  ">
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
    v-if="instanceVars.signupForm"
    v-clickable
    class="signin__action"
    @click="router.push({ name: 'user-signup' })"
  >
    Não possui uma conta?
  </div>
</template>

<script setup lang="ts">
import { provide } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '../../../web'
import { SvForm, SvButton } from '../../components'

const router = useRouter()
const userStore = useStore('user')
const metaStore = useStore('meta')

provide('inputVariant', 'bold')

const authenticate = async () => {
  await userStore.authenticate(userStore.credentials)
  router.push({ name: 'dashboard-home' })
}

</script>
