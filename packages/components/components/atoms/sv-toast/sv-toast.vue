<template>
  <div
    class="toast"
    :style="`animation-delay: ${3+itr*2}s;`"
    @animationend="metaStore.popToast"
  >
    <sv-icon
      v-if="icon"
      small
      :name="icon"
    >
      <slot></slot>
    </sv-icon>

    <slot v-else></slot>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '../../../../web'
import { SvIcon } from '../'

const props = defineProps<{
  itr: number
  icon?: string
}>()

const metaStore = useStore('meta')
</script>

<style scoped src="./sv-toast.scss"></style>
