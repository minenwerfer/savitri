<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useRouter, useStore, usePasswordPolicy } from '@savitri/web'

import SvBox from '../../../../components/sv-box/sv-box.vue'
import SvForm from '../../../../components/form/sv-form/sv-form.vue'
import SvButton from '../../../../components/sv-button/sv-button.vue'

const router = await useRouter()
const userStore = useStore('user')
const metaStore = useStore('meta')

const passwordPolicy = usePasswordPolicy()

const password = reactive({
  password: '',
  confirmation: ''
})

const passwordForm = <const>{
  password: {
    description: 'Senha',
    type: 'string',
    s$inputType: 'password'
  },
  confirmation: {
    description: 'Confirmação da senha',
    type: 'string',
    s$inputType: 'password'
  }
}

const insert = async () => {
  await userStore.insert({
    what: {
      _id: userStore.item._id,
      password: password.password
    }
  })

  await metaStore.spawnModal({
    title: 'Feito!',
    body: 'A senha foi atualizada'
  })

  router.back()
}

const passwordError = computed(() => {
  return passwordPolicy(
    password.password,
    password.confirmation,
  )
})
</script>

<template>
  <sv-box
    outer-header
    class="passchange"
  >
    <template #header>
      <div>Mudando a senha de {{ userStore.item.full_name }}</div>
    </template>
    <div class="passchange__content">
      <sv-form
        v-model="password"
        :form="passwordForm"
      ></sv-form>

      <div>
        {{ passwordError || 'Senhas conferem' }}
      </div>
    </div>

    <template #footer>
      <sv-button
        class="passchange__save-button"
        :disabled="!!passwordError"
        @click="insert"
      >
        Salvar
      </sv-button>
    </template>
  </sv-box>
</template>

<style scoped src="./password-change.scss"></style>
