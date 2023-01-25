<template>
  <sv-icon
    v-clickable
    name="arrow-left"
    @click="router.push({ name: 'user-signup' })"
  >
    Voltar
  </sv-icon>

  <sv-form
    v-if="userExtraStore && instanceVars.signupExtraProperties?.length !== 0"
    v-bind="{
      collection: 'userExtra',
      formData: userExtraStore.item,
      form: instanceVars.signupExtraProperties
        ? userExtraStore.useProperties(instanceVars.signupExtraProperties)
        : userExtraStore.usePropertiesExcept(['owner']),
      validationErrors: userStore.validationErrors
    }"
  ></sv-form>

  <sv-form
    v-bind="{
      form: passwordForm,
      formData: password
    }"
  >
    <template #header>
      Senha
    </template>
    <template #footer>
      {{ passwordError || 'Senhas conferem' }}
    </template>
  </sv-form>

  <div style="
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 2rem
  ">
    <sv-checkbox
      v-model="tosAccepted"
      :property="{
        type: 'boolean',
        s$element: 'checkbox'
      }"
    >
      Declaro que li e aceito os termos de uso
    </sv-checkbox>

    <sv-button
      :disabled="!!passwordError || !tosAccepted"
      @clicked="insert"
    >
      Criar conta
    </sv-button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { hasStore, useStore, usePasswordPolicy } from '../../../web'

import {
  SvForm,
  SvIcon,
  SvCheckbox,
  SvButton,

} from '../..'

const router = useRouter()

const metaStore = useStore('meta')
const userStore = useStore('user')
const userExtraStore = hasStore('userExtra')
  ? useStore('userExtra')
  : null

const passwordPolicy = usePasswordPolicy()

const tosAccepted = ref(false)
const password = reactive({
  password: '',
  confirmation: ''
})

const passwordForm = {
  password: {
    type: 'string',
    s$inputType: 'password'
  },
  confirmation: {
    type: 'string',
    s$inputType: 'password'
  }
}

const passwordError = computed(() => {
  return passwordPolicy(
    password.password,
    password.confirmation,
  )
})

const insert = async () => {
  userStore.item.password = password.password
  if( userExtraStore ) {
    userStore.item.extra = userExtraStore.item
  }

  const user = await userStore.insert().catch(async (e) => {
    const formattedErrors = Object.entries(e.validation)
      .map(([key, value]: [string, any]) => `- ${key}: ${value.type}`)
      .join('\n')

    await metaStore.spawnModal({
      title: 'Erro',
      body: `There were some problems with your submission:\n${formattedErrors}`
    })

    throw e
  })

//
//  const { _id: userId, email } = user

//  if( !userStore.$currentUser._id ) {
//    await userStore.authenticate({
//      email,
//      password: password.password
//    })
//  }

//  if( userExtraStore ) {
//    userExtraStore.item.owner = userId
//    await userExtraStore.deepInsert()
//  }

  await metaStore.spawnModal({
    title: 'Conta registrada',
    body: 'Blabla'
  })

  // router.push({ name: 'user-signin' })
}
</script>
