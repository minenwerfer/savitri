<script setup lang="ts">
import { useStore, useRouter } from '@savitri/web'
import SvForm from '../../components/form/sv-form/sv-form.vue'
import SvButton from '../../components/sv-button/sv-button.vue'

const router = await useRouter()
const userStore = useStore('user')
const metaStore = useStore('meta')

userStorage.clear()

const authenticate = async () => {
  await userStore.authenticate(userStore.credentials)
  router.push('/dashboard')
}
</script>

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
        @click="router.push('/user/signup')"
      >
        Criar uma conta
      </span>
    </div>
  </div>
  <sv-form
    v-model="userStore.credentials"
    :form="{
      email: {
        type: 'string',
        s$icon: 'user',
      },
      password: {
        type: 'string',
        s$icon: 'key-skeleton',
        s$inputType: 'password'
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
      :loading="userStore.loading.authenticate"

      :disabled="
        !userStore.credentials.email
        || !userStore.credentials.password"
      @click="authenticate"
    >
      Entrar
    </sv-button>

    <sv-button
      v-if="userStore.$currentUser._id && !metaStore.isLoading"
      :disabled="userStore.loading.authenticate || metaStore.isLoading"
      @click="router.push('/dashboard')"
    >
      Continuar como {{ userStore.$currentUser.first_name }}
    </sv-button>
  </div>
</template>
