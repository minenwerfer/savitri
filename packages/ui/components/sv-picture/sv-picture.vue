<script setup lang="ts">
import { ref, computed } from 'vue'

type Props = {
  url?: string
  modelValue?: string
  objectFit?: string
  bordered?: boolean
  width?: string
  height?: string
  expandable?: boolean
}

const props = defineProps<Props>()
const url = computed(() => props.url || props.modelValue)

const expand = ref(false)
</script>

<template>
  <figure class="picture">
    <teleport to="#app">
      <img
        v-if="expand"
        v-overlay="{
          click: () => {
            expand = false
          }
        }"

        :src="url"
        :style="`
          position: absolute;
          top: 50%;
          left: 50%;
          max-height: 50vh;
          transform: translate(-50%, -50%);
          object-fit: contain;
        `"

        @click="expand = true"
      />
    </teleport>

    <img
      v-if="url"
      :src="url"
      :class="`
        picture__image
        ${bordered && 'picture__image--bordered'}
        ${expandable && 'picture__image--expandable'}
      `"
      :style="`
        object-fit: ${objectFit || 'cover'};
        width: ${width || '100%'};
        height: ${height || '100%'};
      `"

      @click="() => {
        if( expandable ) {
          expand = true
        }
      }"
    />

    <slot v-else-if="$slots.fallback" name="fallback"></slot>
    <slot v-else-if="$slots.default"></slot>
    <svg
      v-else
      class="picture__background"
      xmlns="https://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      preserveAspectRatio="none"
      :style="`
        object-fit: ${objectFit || 'cover'};
        width: ${width || '100%'};
        height: ${height || '100%'};
      `"
      :class="`
        ${bordered && 'picture__image--bordered'}
      `"
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
