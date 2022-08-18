<template>
  <div v-if="visible" v-overlay="{
    click: close
  }">
    <div class="sidebar">
      <div class="sidebar__header">
        <strong class="text-xl">
          {{ metaStore.sidebar.title }}
        </strong>
        <sv-icon
          v-clickable
          name="arrow-to-right"
          :reactive="true"
          @click="close"
        ></sv-icon>
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
