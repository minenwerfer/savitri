<template>
  <sv-box
    v-if="isShortcutsVisible"
    class="shortcuts"
  >
    <div
      v-clickable
      class="shortcuts__options"
    >
      <sv-icon
        name="house-user"
        class="shortcuts__option"
        @click="router.push({ name: 'dashboard-user-profile' })"
      >
        Perfil de usuário
      </sv-icon>
      <sv-icon
        name="signout"
        class="shortcuts__option"
        @click="signout"
      >
        Sair
      </sv-icon>
    </div>
  </sv-box>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useStore } from '@savitri/web'
import { SvBox, SvIcon } from '../../../../..'
import { isShortcutsVisible } from '../../store'

const router = useRouter()
const userStore = useStore('user')

const signout = () => {
  userStore.signout()
  router.push({ name: 'user-signin' })
}
</script>

<style scoped src="./sv-shortcuts.scss"></style>
