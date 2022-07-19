<template>
  <img
    v-if="file"
    :src="useFile(file).link"
    class="picture"
  />

  <slot v-else-if="$slots.fallback" name="fallback"></slot>
  <slot v-else></slot>
</template>

<script setup lang="ts">
import { useFile } from '../../../../web'

interface Props {
  file: any
}

const props = defineProps<Props>()
</script>

<style scoped src="./sv-picture.scss"></style>
