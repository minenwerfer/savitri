<template>
  <div class="grid place-items-center h-screen bg-gray-100">
    <div class="flex flex-col gap-y-5 w-11/12 sm:w-5/6 md:w-4/6 lg:w-1/2 xl:w-1/3">
      <img
        :src="require('@/../assets/logo.png').default"
        class="object-contain w-36 h-16 md:w-48 md:h-24 self-center"
      />
      <sv-box classes="rounded-b-lg shadow-md bg-stone-50" :fill="true">
        <div class="flex flex-col px-6 py-8 border-t-[10px] ronded-xl border-blue-800">
          <div class="self-center mt-6 mb-12">
            <div class="text-2xl opacity-60">
              {{ webpackVariables.signinText || 'Identifique-se' }}
            </div>
          </div>
          <sv-form
            :form-data="user"
            :form="{
              email: {
                placeholder: 'E-mail',
                icon: 'envelope',
                type: 'text',
                required: true,
              },
              password: {
                placeholder: 'Senha',
                icon: 'lock',
                type: 'password',
                required: true,
              }
            }"
            >
          </sv-form>
          <sv-button
            @clicked="authenticate"
            :disabled="store.state.user.isLoading"
            class="py-3 w-full"
          >
            <div class="w-full">Entrar</div>
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
import { SvBox, SvForm, SvButton } from 'frontend/components'

const store = useStore()
const router = useRouter()

provide('module', 'user')
provide('inputVariant', 'bold')

const authenticate = () => {
  store.dispatch('user/authenticate')
    .then(() => router.push({ name: 'dashboard-home'}))
}

const user = computed(() => store.state.user.current)
const productName = inject('productName')
const productVersion = inject('productVersion')
const baseVersion = inject('baseVersion')
</script>
