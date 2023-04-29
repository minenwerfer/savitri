<script setup lang="ts">
import { computed } from 'vue'

type Props = {
  url?: string
  modelValue?: string
  objectFit?: string
  bordered?: boolean
}

const props = defineProps<Props>()
const url = computed(() => props.url || props.modelValue)
</script>

<template>
  <figure class="picture">
    <img
      v-if="url"
      :src="url"
      :class="`
        picture__image
        ${bordered && 'picture__image--bordered'}
      `"
      :style="`object-fit: ${objectFit || 'cover'}`"
    />

    <slot v-else-if="$slots.fallback" name="fallback"></slot>
    <slot v-else-if="$slots.default"></slot>
    <svg
      v-else
      class="picture__background"
      xmlns="https://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      preserveAspectRatio="none"
    >
      <line x1="0" y1="0" x2="200" y2="200" stroke="#000" vector-effect="non-scaling-stroke"></line>
      <line x1="200" y1="0" x2="0" y2="200" stroke="#000" vector-effect="non-scaling-stroke"></line>
    </svg>

    <figcaption v-if="$slots.caption">
      <slot name="caption"></slot>
    </figcaption>
  </figure>
</template>

<style scoped src="./sv-picture.scss"></style>
