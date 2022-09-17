<template>
  <div class="userExtra">
    <sv-icon
      v-clickable
      name="arrow-left"
      @click="$router.push({ name: 'user-signup' })"
    >
      Voltar
    </sv-icon>

    <sv-form
      v-if="userExtraStore"
      v-bind="{
        collection: 'userExtra',
        formData: userExtraStore.item,
        form: userExtraStore.useFieldsExcept(['owner'])
      }"
    ></sv-form>

    <sv-form
      v-bind="{
        form: passwordForm,
        formData: password
      }"
    ></sv-form>

    <div>
      {{ passwordError || 'Senhas conferem' }}
    </div>

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
  passwordPolicy

} from '@savitri/web'

import {
  SvForm,
  SvIcon,
  SvCheckbox,
  SvButton,

} from '@savitri/components'

const router = useRouter()
const userStore = useParentStore()
const userExtraStore = hasStore('userExtra')
  ? useStore('userExtra')
  : null

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
  const user = await userStore.insert()

  if( !user ) {
    return
  }

  const { _id: userId, email } = user

  if( !userStore.$currentUser._id ) {
    await userStore.authenticate({
      email,
      password: password.password
    })
  }

  if( userExtraStore ) {
    userExtraStore.item.owner = userId
    await userExtraStore.insert()
  }

  const metaStore = useStore('meta')
  await metaStore.spawnModal({
    title: 'Conta registrada',
    body: 'Blabla'
  })

  router.push({ name: 'user-signin' })
}
</script>
