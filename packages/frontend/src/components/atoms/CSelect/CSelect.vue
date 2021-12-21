<template>
  <select
    class="p-2 w-full md:w-auto"
    @change="$emit('update:modelValue', $event.target.value)"
  >
    <slot></slot>
  </select>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: String,
      required: true,
    }
  }
}
</script>
