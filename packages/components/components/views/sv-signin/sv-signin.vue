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
            @clicked="authenticate"
            :disabled="store.state.user.isLoading"
            class="signin__form-button"
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
import { computed, inject, provide } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { default as webpackVariables } from 'variables'
import { SvBox, SvForm, SvButton } from '../../'

import { useStore as useStore1 } from '../../../../web/src/stores'
const userStore = useStore1('user')

const store = useStore()
const router = useRouter()

provide('module', 'user')
provide('inputVariant', 'bold')

const authenticate = async () => {
//  store.dispatch('user/authenticate')
//    .then(() => router.push({ name: 'dashboard-home'}))

  await userStore.authenticate(userStore.credentials)
  router.push({ name: 'dashboard-home' })
}

const user = computed(() => store.state.user.current)
const productName = inject('productName')
const productLogo = inject('productLogo')
const productVersion = inject('productVersion')
const baseVersion = inject('baseVersion')
</script>

<style scoped src="./sv-signin.scss"></style>
