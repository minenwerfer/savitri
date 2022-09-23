<template>
  <div
    class="toast"
    :style="`animation-delay: ${3+itr*2}s;`"
    @animationend="metaStore.popToast"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '../../../../web'

const props = defineProps<{ itr: number }>()
const metaStore = useStore('meta')
</script>

<style scoped src="./sv-toast.scss"></style>
