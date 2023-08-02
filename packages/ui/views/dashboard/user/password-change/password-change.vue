<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter, useStore } from '@savitri/web'

import SvButton from '../../../../components/sv-button/sv-button.vue'
import SvPasswordForm from '../../../../components/dashboard/sv-password-form/sv-password-form.vue'

const router = await useRouter()
const userStore = useStore('user')
const metaStore = useStore('meta')

const password = reactive({
  password: '',
  confirmation: ''
})

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
</script>

<template>
  <div style="
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    max-width: 30rem;
  ">
    <sv-password-form v-model="password" v-slot="{ passwordError }">
      <sv-button
        class="passchange__save-button"
        :disabled="!!passwordError"
        @click="insert"
      >
        Salvar
      </sv-button>
    </sv-password-form>
  </div>
</template>
