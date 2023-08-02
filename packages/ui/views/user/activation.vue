<script setup lang="ts">
import { useRouter, useStore } from '@savitri/web'
import { unsafe } from '@semantic-api/common'
import { reactive } from 'vue'

import SvButton from '../../components/sv-button/sv-button.vue'
import SvPasswordForm from '../../components/dashboard/sv-password-form/sv-password-form.vue'

type Step = 
  | 'success'
  | 'password'

const router = await useRouter()
const userStore = useStore('user')
const metaStore = useStore('meta')

const step: Step = router.currentRoute.value.query.step || 'success'
const userId = router.currentRoute.value.query.u
const token = router.currentRoute.value.query.t

const userInfo: any = unsafe(await userStore.functions.getInfo({
  userId,
  token
}))

const password = reactive({
  full_name: userInfo.full_name,
  email: userInfo.email,
  password: '',
  confirmation: ''
})

const confirm = async () => {
  await userStore.custom(`activate?u=${userId}&t=${token}`, {
    password: password.password
  })

  userStore.credentials.email = password.email

  await metaStore.spawnModal({
    title: 'Sucesso!',
    body: 'Sua conta foi ativada com sucesso. Experimente fazer login com o seu email e senha.'
  })

  router.push('/user/signin')
}
</script>

<template>
  <div v-if="step === 'password'" style="display: grid; gap: 1rem;">
    <h1>Cadastre uma senha</h1>
    <sv-form
      v-model="password"
      :form="{
        full_name: {
          type: 'string',
          readOnly: true
        },
        email: {
          type: 'string',
          readOnly: true
        },
      }"
    ></sv-form>

    <sv-password-form v-model="password" v-slot="{ passwordError }">
      <sv-button
        :disabled="!!passwordError"
        @click="confirm"
      >
        Cadastrar senha papai
      </sv-button>
    </sv-password-form>
  </div>

  <div v-else style="display: grid; gap: 1rem;">
    <h1>Conta ativada com sucesso!</h1>

    <sv-button @click="router.push('/user/signin')">
      Ir para a página de login
    </sv-button>
  </div>
</template>
