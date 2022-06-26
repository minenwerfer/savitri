<template>
  <div class="header">
    <sv-picture
      :file="store.getters['user/current'].picture"
      class="header__picture"

      @click="editProfile"
    ></sv-picture>

    <div class="py-1 text-sm">
      <div class="font-semibold">{{ store.getters['user/current'].first_name }}</div>
      <div class="opacity-60">{{ store.getters['user/current'].access?.name }}</div>
      <div class="font-semibold text-xs opacity-80 mt-1">Sair</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useModule } from '../../../../../../../frontend'
import { SvPicture } from '../../../../../..'

const store = useStore()
const router = useRouter()

const moduleRefs = useModule('user', store)

const editProfile = () => {
  moduleRefs.setItem(store.getters['user/current'])
  router.push({ name: 'dashboard-user-profile' })
}
</script>

<style scoped src="./sv-menu-header.scss"></style>
