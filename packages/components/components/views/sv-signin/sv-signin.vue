<template>
  <div class="grid place-items-center h-screen bg-gray-100">
    <div class="flex flex-col gap-y-6 w-11/12 sm:w-5/6 md:w-4/6 lg:w-[34em]">
      <img
        :src="require(`@/assets/${productLogo}`).default"
        style="width: 10em; height: 3em" class="object-contain self-center"
      />
      <sv-box>
        <div style="padding: 1.4em" class="flex justify-center">
          <div class="flex flex-col items-center gap-y-6 w-[28em]">
            <div class="py-6 text-2xl font-bold opacity-80" v-html="webpackVariables.signinText || 'Identifique-se'"></div>
            <sv-form
              :form-data="user"
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
              style="padding: .8em 0; width: 100%;"
            >
              <div class="w-full">Entrar</div>
            </sv-button>
          </div>
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
const productLogo = inject('productLogo')
const productVersion = inject('productVersion')
const baseVersion = inject('baseVersion')
</script>
