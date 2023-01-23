<template>
  <a
    role="icon"
    :class="`
      icon
      ${reactive && 'icon--reactive'}
      ${alt && 'icon--alt'}
      ${$slots.default && 'icon--centered'}
  `">
    <div :class="`
      icon__icon
      ${ size && `icon__icon--${size}` }
      ${ iconRight && 'icon__icon--right' }
      ${
        small
          ? 'icon__icon--small'
          : 'icon__icon--medium'
      }
    `">
      <unicon
        v-bind="{
          name,
          fill
        }"
        role="icon-img"
      ></unicon>
    </div>
    <div v-if="$slots.default" role="icon-label">
      <slot></slot>
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
  iconRight?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  reactive: null
})

const size = props.size || inject('iconSize', null)
const reactive = typeof props.reactive === 'boolean'
  ? props.reactive
  : inject('iconReactive', false)
</script>

<style scoped src="./sv-icon.scss"></style>
