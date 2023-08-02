<script setup lang="ts">
import { useRouter, useStore, usePasswordPolicy } from '@savitri/web'
import { unsafe } from '@semantic-api/common'
import { reactive, computed } from 'vue'
import SvForm from '../../components/form/sv-form/sv-form.vue'
import SvButton from '../../components/sv-button/sv-button.vue'

type Step = 
  | 'success'
  | 'password'

const router = await useRouter()
const userStore = useStore('user')
const metaStore = useStore('meta')
const passwordPolicy = usePasswordPolicy()

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

const passwordError = computed(() => {
  return passwordPolicy(
    password.password,
    password.confirmation,
  )
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
        password: {
          type: 'string',
          s$icon: 'key-skeleton',
          s$inputType: 'password'
        },
        confirmation: {
          type: 'string',
          s$icon: 'key-skeleton',
          s$inputType: 'password'
        }
      }"
    ></sv-form>

    <div>
      {{ passwordError || 'Senhas conferem' }}
    </div>

    <sv-button
      :disabled="!!passwordError"
      @click="confirm"
    >
      Cadastrar senha
    </sv-button>
  </div>

  <div v-else style="display: grid; gap: 1rem;">
    <h1>Conta ativada com sucesso!</h1>

    <sv-button @click="router.push('/user/signin')">
      Ir para a página de login
    </sv-button>
  </div>
</template>
