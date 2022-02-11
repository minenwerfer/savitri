<template>
  <sv-bare-button v-if="webpackVariables.releases" @clicked="spawnSidebar('Notas de atualização', 'sv-releases')">
    <unicon name="newspaper" fill="black"></unicon>
  </sv-bare-button>
  <sv-bare-button v-if="webpackVariables.notification" @clicked="spawnSidebar('Notificações', 'sv-notifications')">
    <unicon name="bell" fill="black"></unicon>
  </sv-bare-button>
  <sv-bare-button @clicked="spawnSidebar('Usuário', 'sv-profile')">
    <unicon name="user" fill="black"></unicon>
  </sv-bare-button>
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import { SvBareButton } from 'frontend/components'
import { default as webpackVariables } from 'variables'

const store = useStore()

const spawnSidebar = (title: string, component: string) => {
  store.dispatch('meta/spawnSidebar', {
    title,
    component
  })
}
</script>
