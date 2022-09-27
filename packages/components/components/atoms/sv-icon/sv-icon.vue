<template>
  <a :class="`
    icon
    ${reactive && 'icon--reactive'}
    ${$slots.default && 'icon--centered'}
  `">
    <div :class="`
      icon__icon
      ${
        small
          ? 'icon__icon--small'
          : 'icon__icon--medium'
      }
    `">
      <unicon v-bind="props"></unicon>
    </div>
    <slot v-if="$slots.default"></slot>
  </a>
</template>

<script setup lang="ts">
import { inject } from 'vue'

type Props = {
  name: string
  fill?: string
  small?: boolean
  reactive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  reactive: null
})

const size = props.size || inject('iconSize', 'medium')
const reactive = typeof props.reactive === 'boolean'
  ? props.reactive
  : inject('iconReactive', false)
</script>

<style scoped src="./sv-icon.scss"></style>
