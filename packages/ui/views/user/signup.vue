<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter, useStore, hasStore, usePasswordPolicy } from '@savitri/web'
import SvForm from '../../components/form/sv-form/sv-form.vue'
import SvIcon from '../../components/sv-icon/sv-icon.vue'
import SvButton from '../../components/sv-button/sv-button.vue'
import SvCheckbox from '../../components/form/sv-checkbox/sv-checkbox.vue'
import SvPasswordForm from '../../components/dashboard/sv-password-form/sv-password-form.vue'

const router = await useRouter()
const userStore = useStore('user')
const metaStore = useStore('meta')

if( !metaStore.descriptions.user ) {
  await metaStore.describe({
    collections: ['user'],
    roles: true
  })
}

const passwordPolicy = usePasswordPolicy()

const tosAccepted = ref(false)
const password = reactive({
  password: '',
  confirmation: ''
})

const passwordForm = {
  password: {
    type: 'string',
    s$inputType: 'password'
  },
  confirmation: {
    type: 'string',
    s$inputType: 'password'
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
  const user = await userStore.insert().catch(async (e) => {
    await userStore.errorPopup(e)
    router.back()

    throw e
  })

//
//  const { _id: userId, email } = user

//  if( !userStore.$currentUser._id ) {
//    await userStore.authenticate({
//      email,
//      password: password.password
//    })
//  }

  await metaStore.spawnModal({
    title: 'Conta registrada',
    body: 'Blabla'
  })

  // router.push({ name: 'user-signin' })
}
</script>

<template>
  <div>
    <h1>Criar conta</h1>
    <sv-icon
      v-clickable
      name="arrow-left"
      @click="router.push({ name: '/user/signin' })"
    >
      Efetuar login
    </sv-icon>
  </div>

  <sv-form
    v-model="userStore.item"
    v-bind="{
      collection: 'user',
      form: userStore.useProperties([
        'full_name',
        'email',
        'phone'
      ])
    }"
  >
    <template #after>
      <sv-password-form v-model="password" v-slot="{ passwordError }">
        <div style="
          display: flex;
          flex-direction: column;
          align-items: start;
          gap: 2rem
        ">
          <sv-checkbox
            v-model="tosAccepted"
            :property="{
              type: 'boolean',
              s$element: 'checkbox'
            }"
          >
            Declaro que li e aceito os termos de uso
          </sv-checkbox>

        </div>

        <sv-button
          :disabled="!!passwordError || !tosAccepted"
          @click="insert"
        >
          Criar conta
        </sv-button>
      </sv-password-form>
    </template>
  </sv-form>


</template>
