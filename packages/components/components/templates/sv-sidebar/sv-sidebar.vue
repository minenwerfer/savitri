<template>
  <div v-if="visible" v-overlay="{
    click: close
  }">
    <div class="sidebar">
      <div class="sidebar__header">
        <strong class="text-xl">
          {{ metaStore.sidebar.title }}
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
            :is="components[metaStore.sidebar.component]"
            v-bind="metaStore.sidebar.componentProps"
            @close="close"
          ></component>
        </KeepAlive>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '@savitri/web'
import {
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

const metaStore = useStore('meta')
const close = () => { metaStore.sidebar.isVisible }
</script>

<style scoped src="./sv-sidebar.scss"></style>
