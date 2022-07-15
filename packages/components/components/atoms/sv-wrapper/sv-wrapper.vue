<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { provide } from 'vue'
const props = defineProps()

provide(props)
</script>
