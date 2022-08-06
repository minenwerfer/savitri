<template>
  <div :class="`
    icon
    ${reactive && 'icon--reactive'}
    ${$slots.default && 'icon--centered'}
  `">
    <unicon v-bind="props"></unicon>
    <slot v-if="$slots.default"></slot>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'

type Props = {
  name: string
  fill?: string
  reactive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  reactive: false
})

const reactive = inject('iconReactive', props.reactive)
</script>

<style scoped src="./sv-icon.scss"></style>
