<template>
  <img
    v-if="file"
    :src="useFile(file).link"
    class="object-cover w-full h-full"
  />

  <slot v-else-if="$slots.fallback" name="fallback"></slot>
  <slot v-else></slot>
</template>

<script setup lang="ts">
import { useFile } from '../../../frontend'

const props = defineProps<{
  file: any
}>()
</script>
