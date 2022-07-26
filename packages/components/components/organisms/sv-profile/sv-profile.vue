<template>
  <div class="profile">
    <sv-picture
      :file="store.currentUser.picture"
      class="profile__picture"
    >
      <template #fallback>
        <!-- <inline-svg -->
        <!--   :src="require('../../../assets/svg/profile.svg').default" -->
        <!-- ></inline-svg> -->
      </template>
    </sv-picture>
    <div class="flex flex-col gap-y-2 opacity-80 border-b text-center pb-4">
      <strong class="text-xl">{{ store.currentUser.name }}</strong>
      <div>Autenticado como: {{ store.currentUser.access?.name }}</div>
    </div>

    <div class="profile__menu">
      <sv-bare-button @clicked="editProfile">Editar perfil</sv-bare-button>
      <component :is="profileSidebarSlot" v-if="profileSidebarSlot"></component>

      <sv-bare-button @clicked="signout">Sair</sv-bare-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { default as InlineSvg } from 'vue-inline-svg'
import { useRouter } from 'vue-router'
import { useStore } from '@savitri/web'
import { SvBareButton, SvPicture } from '../..'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const store = useStore('user')
const router = useRouter()

const profileSidebarSlot = inject('profileSidebarSlot')

const signout = async () => {
  emit('close')
  await store.dispatch('user/signout')
  router.push({ name: 'signin' })
}

const editProfile = () => {
  emit('close')
  store.setItem(store.currentUser)
  router.push({ name: 'dashboard-user-profile' })
}
</script>

<style scoped src="./sv-profile.scss"></style>
