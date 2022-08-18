<template>
  <div class="onboarding">
    <sv-icon
      v-clickable
      name="arrow-left"
      @click="$router.push({ name: 'user-signup' })"
    >
      Voltar
    </sv-icon>


    <sv-form
      v-bind="{
        collection: 'onboarding',
        formData: onboardingStore.item,
        form: onboardingStore.fields
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
      @clicked="onboardingStore.insert"
    >
      Criar conta
    </sv-button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useStore, useParentStore, passwordPolicy } from '@savitri/web'
import {
  SvForm,
  SvIcon,
  SvCheckbox,
  SvButton,

} from '@savitri/components'

const userStore = useParentStore()
const onboardingStore = useStore('onboarding')

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
</script>
