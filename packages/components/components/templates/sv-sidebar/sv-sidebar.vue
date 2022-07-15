<template>
  <div v-if="visible">
    <sv-overlay @click="close"></sv-overlay>
    <div class="sidebar">
      <div class="sidebar__header">
        <strong class="text-xl">
          {{ $store.state.meta.sidebar.title }}
        </strong>
        <sv-bare-button @clicked="close">
          <sv-icon
            name="arrow-to-right"
            fill="black"
            :reactive="true"
          ></sv-icon>
        </sv-bare-button>
      </div>

      <div class="sidebar__content">
        <KeepAlive>
          <component
            :is="components[store.state.meta.sidebar.component]"
            v-bind="store.state.meta.sidebar.componentProps"
            @close="close"
          ></component>
        </KeepAlive>
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


} from '../../'

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

<style scoped src="./sv-sidebar.scss"></style>
