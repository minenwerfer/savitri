<template>
  <div class="picture">
    <img
      v-if="url"
      v-lazy="url"
      :class="`
        picture__image
        ${contain && 'picture__image--contain'}
      `"
    />

    <slot v-else-if="$slots.fallback" name="fallback"></slot>
    <slot v-else></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Props = {
  url?: string
  modelValue?: string
  contain?: boolean
}

const props = defineProps<Props>()
const url = computed(() => props.url || props.modelValue)
</script>

<style scoped src="./sv-picture.scss"></style>
