<template>
  <img
    v-if="file"
    :src="fileLink(file)"
    class="picture"
  />

  <slot v-else-if="$slots.fallback" name="fallback"></slot>
  <slot v-else></slot>
</template>

<script setup lang="ts">
type Props = {
  file: any
}

const props = defineProps<Props>()
const fileLink = (file: any) =>
  file.link||file
</script>

<style scoped src="./sv-picture.scss"></style>
