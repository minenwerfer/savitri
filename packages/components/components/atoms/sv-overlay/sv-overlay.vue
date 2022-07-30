<template>
  <div :class="`overlay ${invisible || 'overlay--visible'}`"></div>
</template>

<script setup lang="ts">
type Props = {
  invisible?: boolean
}

const props = defineProps<Props>()
</script>

<style scoped src="./sv-overlay.scss"></style>
