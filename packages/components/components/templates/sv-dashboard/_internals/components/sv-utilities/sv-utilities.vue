<template>
  <sv-info v-if="webpackVariables.releases" where="bottom">
    <template #text>Notas de atualização</template>
    <sv-bare-button @clicked="spawnSidebar('Querido diário', 'sv-releases', { updateRoute: false })">
      <sv-new :last="lastRelease" v-model="lastReadRelease">
        <sv-icon name="newspaper"></sv-icon>
      </sv-new>
    </sv-bare-button>
  </sv-info>

  <sv-info v-if="webpackVariables.notification" where="bottom">
    <template #text>Notificações</template>
    <sv-bare-button @clicked="spawnSidebar('Notificações', 'sv-notifications')">
      <sv-icon name="bell"></sv-icon>
    </sv-bare-button>
  </sv-info>

  <sv-info where="bottom">
    <template #text>Menu</template>
    <sv-bare-button @clicked="spawnSidebar('Usuário', 'sv-profile')">
      <div class="flex gap-x-2 border border-gray-300 rounded-lg px-2 py-1 bg-white text-sm items-center">
        <div class="hidden md:inline-flex">{{ $store.getters['user/current'].first_name || 'Usuário' }}</div>
        <sv-icon name="user-circle"></sv-icon>
      </div>
    </sv-bare-button>
  </sv-info>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useStore } from 'vuex'
import {
  SvBareButton,
  SvInfo,
  SvIcon,
  SvNew

} from '../../../../..'

import { default as webpackVariables } from 'variables'

const store = useStore()

onMounted(() => {
  if( webpackVariables.releases ) {
    store.dispatch('release/getAll')
  }
})

const spawnSidebar = (title: string, component: string, componentProps: any = {}) => {
  store.dispatch('meta/spawnSidebar', {
    title,
    component,
    componentProps
  })
}

const lastRelease = computed(() => store.getters['release/item'].product?.length)
const _lastReadRelease = ref(0)

const lastReadRelease = computed({
  get: () => _lastReadRelease.value || localStorage.getItem('lastReadRelease'),
  set: (value: any) => {
    _lastReadRelease.value = value
    localStorage.setItem('lastReadRelease', value)
  }
})
</script>
