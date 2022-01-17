<template>
  <textarea
    class="border-2 border-gray-300 focus:border-purple-500 outline-none w-full h-32 px-2 py-1 text-gray-600"
    @input="$emit('update:modelValue', $event.target.value)"
  >{{ $props.modelValue }}</textarea>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue?: string
}>()
</script>
