<template>
  <div class="header">
    <sv-picture
      :file="userStore.$currentUser.picture"
      class="header__picture"

      @click="editProfile"
    ></sv-picture>

    <div class="py-1 text-sm">
      <div class="font-semibold">{{ userStore.$currentUser.first_name }}</div>
      <div class="opacity-60">{{ userStore.$currentUser.access?.name }}</div>
      <div class="font-semibold text-xs opacity-80 mt-1">Sair</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useStore } from '@savitri/web'
import { SvPicture } from '../../../../../..'

const userStore = useStore('user')
const router = useRouter()

const editProfile = () => {
  userStore.setItem(userStore.currentUser)
  router.push({ name: 'dashboard-user-profile' })
}
</script>

<style scoped src="./sv-menu-header.scss"></style>
