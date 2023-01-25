<template>
  <div
    v-if="instanceVars.signinText"
    v-html="instanceVars.signinText"
  ></div>
  <sv-form
    :form-data="userStore.credentials"
    :form="{
      email: {
        type: 'string',
        s$placeholder: 'E-mail',
        s$icon: 'user',
        s$inputType: 'email'
      },
      password: {
        type: 'string',
        s$placeholder: 'Senha',
        s$icon: 'key-skeleton',
        s$inputType: 'password'
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
    v-if="instanceVars.signupForm"
    v-clickable
    class="signin__action"
    @click="router.push({ name: 'user-signup' })"
  >
    Não possui uma conta?
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
