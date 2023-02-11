<template>
  <div style="text-align: center">
    <h1
      v-if="instanceVars.signinText"
      v-html="instanceVars.signinText"
      style="font-size: 2.4rem; margin-bottom: .8rem"
    ></h1>
    <div
      v-if="instanceVars.signupForm"
    >
      <span>Não possui uma conta?</span>
      <span 
        v-clickable
        style="color: #2d96fa"
        @click="router.push({ name: 'user-signup' })"
      >
        Criar uma conta
      </span>
    </div>
  </div>
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
      :disabled="
        userStore.isLoading
        || !userStore.credentials.email
        || !userStore.credentials.password"
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
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useStore } from '../../../web'
import { SvForm, SvButton } from '../../components'

const router = useRouter()
const userStore = useStore('user')
const metaStore = useStore('meta')

const authenticate = async () => {
  await userStore.authenticate(userStore.credentials)
  router.push({ name: 'dashboard-home' })
}

</script>
