<template>
  <sv-bare-button v-if="webpackVariables.releases" @clicked="spawnSidebar('Notas de atualização', 'sv-releases')">
    <unicon name="newspaper" fill="gray"></unicon>
  </sv-bare-button>
  <sv-bare-button v-if="webpackVariables.notification" @clicked="spawnSidebar('Notificações', 'sv-notifications')">
    <unicon name="bell" fill="gray"></unicon>
  </sv-bare-button>

  <sv-bare-button @clicked="spawnSidebar('Usuário', 'sv-profile')">
    <div class="flex gap-x-2 border border-gray-300 rounded-lg px-2 py-1 bg-white text-sm items-center">
      <div class="hidden md:inline-flex">{{ $store.getters['user/current'].first_name || 'Usuário' }}</div>
      <unicon name="user" fill="gray"></unicon>
    </div>
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
