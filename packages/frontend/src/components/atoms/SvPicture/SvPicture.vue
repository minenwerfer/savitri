<template>
  <img
    v-if="file"
    :src="`${SV_API_URL}/download/${file._id||file}`"

    class="object-cover w-full h-full"
  />

  <slot v-else-if="$slots.fallback" name="fallback"></slot>
  <slot v-else></slot>
</template>

<script setup lang="ts">
import { SV_API_URL } from 'frontend/store/module'

const props = defineProps<{
  file: any
}>()
</script>
