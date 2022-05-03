<template>
  <sv-info v-if="webpackVariables.releases" where="bottom" class="inline-flex">
    <template #text>Notas de atualização</template>
    <sv-bare-button @clicked="spawnSidebar('Notas de atualização', 'sv-releases')">
      <sv-icon name="newspaper" fill="gray"></sv-icon>
    </sv-bare-button>
  </sv-info>

  <sv-info v-if="webpackVariables.notification"  where="bottom" class="inline-flex">
    <template #text>Notificações</template>
    <sv-bare-button @clicked="spawnSidebar('Notificações', 'sv-notifications')">
      <sv-icon name="bell" fill="gray"></sv-icon>
    </sv-bare-button>
  </sv-info>

  <sv-info where="bottom" class="inline-flex">
    <template #text>Menu</template>
    <sv-bare-button @clicked="spawnSidebar('Usuário', 'sv-profile')">
      <div class="flex gap-x-2 border border-gray-300 rounded-lg px-2 py-1 bg-white text-sm items-center">
        <div class="hidden md:inline-flex">{{ $store.getters['user/current'].first_name || 'Usuário' }}</div>
        <sv-icon name="user-circle" fill="gray"></sv-icon>
      </div>
    </sv-bare-button>
  </sv-info>
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import {
  SvBareButton,
  SvInfo,
  SvIcon

} from '../../../../..'

import { default as webpackVariables } from 'variables'

const store = useStore()

const spawnSidebar = (title: string, component: string) => {
  store.dispatch('meta/spawnSidebar', {
    title,
    component
  })
}
</script>
