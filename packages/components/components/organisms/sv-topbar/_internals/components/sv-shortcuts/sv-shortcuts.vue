<template>
  <sv-box
    v-model:visible="isShortcutsVisible"
    v-bind="{
      overlay: true,
      invisibleOverlay: true
    }"
    class="shortcuts"
    @overlay-clicked="isShortcutsVisible = false"
  >
    <div class="shortcuts__options">
      <sv-icon name="house-user">
        Perfil de usuário
      </sv-icon>
      <sv-icon
        name="signout"
        @click="userStore.signout()"
      >
        Sair
      </sv-icon>
    </div>
  </sv-box>
</template>

<script setup lang="ts">
import { useStore } from '@savitri/web'
import { SvBox, SvIcon } from '../../../../..'
import { isShortcutsVisible } from '../../store'

const userStore = useStore('user')
</script>

<style scoped src="./sv-shortcuts.scss"></style>
