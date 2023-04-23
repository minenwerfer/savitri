<template>
  <div style="flex: 1"></div>
  <sv-button
    small
    @click="$router.push({ name: 'dashboard-user-changepass' })"
    style="align-self: center;"
  >
    Mudar senha
  </sv-button>
</template>

<script setup lang="ts">
import SvButton from '../../../../../components/sv-button/sv-button.vue'
</script>
