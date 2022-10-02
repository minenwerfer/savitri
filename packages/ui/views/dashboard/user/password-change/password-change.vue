<template>
  <div>Mudando a senha de {{ userStore.item.name }}</div>
  <sv-box class="passchange">
    <div class="passchange__content">
      <sv-form
        v-bind="{
          form: passwordForm,
          formData: password
        }"
      ></sv-form>

      <div>
        {{ passwordError || 'Senhas conferem' }}
      </div>

      <sv-button
        class="passchange__save-button"
        :disabled="passwordError"
        @clicked="insert"
      >
        Salvar
      </sv-button>
    </div>
  </sv-box>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore, passwordPolicy } from '@savitri/web'
import { SvBox, SvForm, SvButton } from '../../../..'

const router = useRouter()
const userStore = useStore('user')
const metaStore = useStore('meta')

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

<style scoped src="./password-change.scss"></style>
