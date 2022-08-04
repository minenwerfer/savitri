<template>
  <div class="signin">
    <div class="signin__content">
      <img
        class="signin__logo"
        :src="require(`@/assets/${productLogo}`).default"
      />
      <sv-box>
        <div class="signin__form-container">
          <div v-html="webpackVariables.signinText || 'Identifique-se'"></div>
          <sv-form
            :form-data="userStore.credentials"
            :form="{
              email: {
                placeholder: 'E-mail',
                icon: 'user',
                type: 'text',
                required: true,
              },
              password: {
                placeholder: 'Senha',
                icon: 'key-skeleton',
                type: 'password',
                required: true,
              }
            }"
          ></sv-form>
          <sv-button
            class="signin__form-button"
            :disabled="userStore.isLoading"
            @clicked="authenticate"
          >
            <div class="signin__form-button-text">Entrar</div>
          </sv-button>
        </div>
      </sv-box>
      <div class="self-center opacity-40 text-sm">
        v{{ productVersion }} running on Savitri v{{baseVersion}}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, provide } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '@savitri/web'
import { default as webpackVariables } from 'variables'
import { SvBox, SvForm, SvButton } from '../../'

const userStore = useStore('user')
const router = useRouter()

provide('inputVariant', 'bold')

const authenticate = async () => {
  await userStore.authenticate(userStore.credentials)
  router.push({ name: 'dashboard-home' })
}

const productName = inject('productName')
const productLogo = inject('productLogo')
const productVersion = inject('productVersion')
const baseVersion = inject('baseVersion')
</script>

<style scoped src="./sv-signin.scss"></style>
