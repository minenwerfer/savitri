<template>
  <div class="profile">
    <sv-picture
      :file="current.picture"
      class="profile__picture"
    >
      <template #fallback>
        <!-- <inline-svg -->
        <!--   :src="require('../../../assets/svg/profile.svg').default" -->
        <!-- ></inline-svg> -->
      </template>
    </sv-picture>
    <div class="flex flex-col gap-y-2 opacity-80 border-b text-center pb-4">
      <strong class="text-xl">{{ current.name }}</strong>
      <div>Autenticado como: {{ current.access?.name }}</div>
    </div>

    <div class="profile__menu">
      <sv-bare-button @clicked="editProfile">Editar perfil</sv-bare-button>
      <component :is="profileSidebarSlot" v-if="profileSidebarSlot"></component>

      <sv-bare-button @clicked="signout">Sair</sv-bare-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  reactive,
  toRefs,
  inject

} from 'vue'

import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { default as InlineSvg } from 'vue-inline-svg'
import { useModule } from '../../../../web'
import { SvBareButton, SvPicture } from '../..'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const store = useStore()
const router = useRouter()
const moduleRefs = reactive(useModule('user', store))

const profileSidebarSlot = inject('profileSidebarSlot')
const current = computed(() => store.getters['user/current'])

const signout = async () => {
  emit('close')
  await store.dispatch('user/signout')
  router.push({ name: 'signin' })
}

const editProfile = () => {
  emit('close')
  moduleRefs.setItem(store.getters['user/current'])
  router.push({ name: 'dashboard-user-profile' })
}

const {
  item

} = toRefs(moduleRefs)
</script>

<style scoped src="./sv-profile.scss"></style>
