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
        Usuário
      </sv-icon>
      <sv-icon name="signout">
        Sair
      </sv-icon>
    </div>
  </sv-box>
</template>

<script setup lang="ts">
import { SvBox, SvIcon } from '../../../../..'
import { isShortcutsVisible } from '../../store'
</script>

<style scoped src="./sv-shortcuts.scss"></style>
