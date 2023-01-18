<template>
  <div class="header">
    <sv-user-picture
      :user="userStore.$currentUser"
      class="header__picture"
      @click="editProfile"
    ></sv-user-picture>

    <div class="header__info">
      <div class="header__info-name">{{ userStore.$currentUser.full_name }}</div>
      <div class="header__info-access">{{ userStore.$currentUser.roles?.join(', ') }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useStore } from '../../../../../../../web'
import { SvUserPicture } from '../../../../../..'

const userStore = useStore('user')
const router = useRouter()

const editProfile = () => {
  userStore.setItem(userStore.currentUser)
  router.push({ name: 'dashboard-user-profile' })
}
</script>

<style scoped src="./sv-menu-header.scss"></style>
