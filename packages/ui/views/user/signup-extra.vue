<template>
  <sv-icon
    v-clickable
    name="arrow-left"
    @click="router.push({ name: 'user-signup' })"
  >
    Voltar
  </sv-icon>

  <sv-form
    v-if="userExtraStore"
    v-bind="{
      collection: 'userExtra',
      formData: userExtraStore.item,
      form: webpackVariables.signupExtraProperties
        ? userExtraStore.useProperties(webpackVariables.signupExtraProperties)
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

  <div class="userExtra__footer">
    <sv-checkbox v-model="tosAccepted">
      Declaro que li e aceito os termos de uso
    </sv-checkbox>

    <sv-button
      :disabled="passwordError || !tosAccepted"
      @clicked="insert"
    >
      Criar conta
    </sv-button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  hasStore,
  useStore,
  useParentStore,

} from '../../../web'

import { usePasswordPolicy } from '../../composables'

import {
  SvForm,
  SvIcon,
  SvCheckbox,
  SvButton,

} from '../..'

// import { default as webpackVariables } from 'variables'

const webpackVariables = {}

const router = useRouter()
const userStore = useParentStore()
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
    label: 'Senha',
    type: 'password'
  },
  confirmation: {
    label: 'Confirmação da senha',
    type: 'password'
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

  const user = await userStore.insert()
  console.log(user)

//  if( !user ) {
//    return
//  }
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

  const metaStore = useStore('meta')
  await metaStore.spawnModal({
    title: 'Conta registrada',
    body: 'Blabla'
  })

  // router.push({ name: 'user-signin' })
}
</script>
