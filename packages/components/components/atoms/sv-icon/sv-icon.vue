<template>
  <div :class="`icon ${reactive && 'icon--reactive'}`">
    <unicon
      v-bind="props"
    ></unicon>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'

const props = defineProps<{
  name: string
  fill?: string
  reactive?: boolean
}>()

const reactive = inject('iconReactive', props.reactive)
</script>

<style scoped src="./sv-icon.scss"></style>
