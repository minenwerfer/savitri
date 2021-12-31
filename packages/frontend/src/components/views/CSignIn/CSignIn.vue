<template>
  <div class="flex">
    <div class="w-full md:w-6/12 lg:w-4/12 place-self-center px-8 md:px-10">
      <div class="font-bold text-4xl mb-4">
        {{ $t(productName) }}
      </div>
      <c-form
        :form-data="user"
        :form="{
          email: {
            label: 'E-mail',
            type: 'text',
            required: true,
          },
          password: {
            label: 'Senha',
            type: 'password',
            required: true,
          }
        }"
        >
      </c-form>
      <c-button @clicked="authenticate" :disabled="store.state.user.isLoading">Entrar</c-button>

      <div class="font-semibold opacity-40 mt-10">
        v{{ productVersion }} running on Savitri v{{ baseVersion }}
      </div>
    </div>
    <div class="flex-grow bg-gradient-to-tr from-blue-500 to-green-800"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { CForm, CButton } from 'frontend/components'

const store = useStore()
const router = useRouter()

const authenticate = () => {
  store.dispatch('user/authenticate')
    .then(() => router.push({ name: 'dashboard-home'}))
}

const user = computed(() => store.state.user.current)
const productName = inject('productName')
const productVersion = inject('productVersion')
const baseVersion = inject('baseVersion')
</script>
