<template>
  <div v-if="visible">
    <sv-overlay @click="close"></sv-overlay>
    <div class="fixed top-0 right-0 z-50 h-screen bg-zinc-50 py-6 w-screen md:w-3/6 lg:w-3/12 shadow-lg animate-slip transform-gpu">
      <div class="flex flex-col gap-y-6 px-auto">
        <div class="flex justify-between">
          <strong class="text-xl">
            {{ $store.state.meta.sidebar.title }}
          </strong>
          <sv-bare-button @clicked="close">
            <sv-icon name="arrow-to-right" fill="black"></sv-icon>
          </sv-bare-button>
        </div>

        <div class="h-screen overflow-auto">
          <component
            :is="components[store.state.meta.sidebar.component]"
            @close="close"
          ></component>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import {
  SvOverlay,
  SvBareButton,
  SvReleases,
  SvProfile,
  SvNotifications,
  SvIcon


} from 'components'

const components = {
  'sv-releases': SvReleases,
  'sv-notifications': SvNotifications,
  'sv-profile': SvProfile,
}

const {
  visible = false,
  ...props

} = defineProps<{
  visible: boolean

}>()

const store = useStore()
const close = () => store.dispatch('meta/closeSidebar')
</script>
