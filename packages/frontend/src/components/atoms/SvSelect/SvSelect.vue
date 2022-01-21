<template>
  <select
    ref="select"
    class="p-2 w-full"

    :key="modelValue"
    :value="modelValue"
    @change="$emit('update:modelValue', $event.target.value)"
  >
    <slot></slot>
  </select>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue?: string
}>()
</script>
