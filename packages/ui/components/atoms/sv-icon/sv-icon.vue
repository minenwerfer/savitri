<template>
  <a
    role="icon"
    :class="`
      icon
      ${reactive && 'icon--reactive'}
      ${selected && 'icon--selected'}
      ${alt && 'icon--alt'}
      ${$slots.default && 'icon--centered'}
  `">
    <div :class="`
      icon__icon
      ${ size && `icon__icon--${size}` }
      ${
        small
          ? 'icon__icon--small'
          : 'icon__icon--medium'
      }
    `">
      <unicon
        v-bind="{
          fill
        }"
        role="icon-img"
      ></unicon>
    </div>
    <div role="icon-label">
      <slot v-if="$slots.default"></slot>
    </div>
  </a>
</template>

<script setup lang="ts">
import { inject } from 'vue'

type Props = {
  name: string
  fill?: string
  size?: string
  small?: boolean
  alt?: boolean
  reactive?: boolean|null
  selected?: boolean
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
