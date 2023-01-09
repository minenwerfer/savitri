<template>
  <sv-info v-if="webpackVariables.releases" where="bottom">
    <template #text>Notas de atualização</template>
    <sv-new
      v-clickable
      v-model="lastReadRelease"
      :last="lastRelease"
    >
      <sv-icon name="newspaper"></sv-icon>
    </sv-new>
  </sv-info>

  <sv-info v-if="webpackVariables.notification" where="bottom">
    <template #text>Notificações</template>
    <sv-icon
      v-clickable
      name="bell"
    ></sv-icon>
  </sv-info>
</template>

<script setup lang="ts">
import {
  //onMounted,
  provide,
  computed,
  reactive,
  ref

} from 'vue'

import { SvInfo, SvIcon } from '../../../../../components'
// import { default as webpackVariables } from 'variables'

const webpackVariables = {}

const release = reactive({
  product: []
})

provide('release', release)

//onMounted(async () => {
//  if( webpackVariables.releases ) {
//    Object.assign(release, await http.get('_/release/getAll').data?.result)
//  }
//})

const lastRelease = computed(() => release.product.length)
const _lastReadRelease = ref(0)

const lastReadRelease = computed({
  get: () => _lastReadRelease.value || localStorage.getItem('lastReadRelease'),
  set: (value: any) => {
    _lastReadRelease.value = value
    localStorage.setItem('lastReadRelease', value)
  }
})
</script>
