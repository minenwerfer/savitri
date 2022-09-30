<template>
  <div class="header">
    <sv-picture
      :url="userStore.$currentUser.picture.link"
      class="header__picture"
      @click="editProfile"
    >
      <sv-icon name="user"></sv-icon>
    </sv-picture>

    <div class="header__info">
      <div class="header__info-name">{{ userStore.$currentUser.first_name }}</div>
      <div class="header__info-access">{{ userStore.$currentUser.role }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useStore } from '@savitri/web'
import { SvPicture, SvIcon } from '../../../../../..'

const userStore = useStore('user')
const router = useRouter()

const editProfile = () => {
  userStore.setItem(userStore.currentUser)
  router.push({ name: 'dashboard-user-profile' })
}
</script>

<style scoped src="./sv-menu-header.scss"></style>
