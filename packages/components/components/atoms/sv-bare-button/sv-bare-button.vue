<template>
  <button
    :class="`
      active:underline flex items-center gap-x-1
      inline-block select-none outline-none
      ${
        !disabled
          ? 'cursor-pointer'
          : 'cursor-not-allowed opacity-50'
      }
      `"
    @click="onClick"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'clicked', event: any): void
}>()

const onClick = (event: any) => {
  event.stopPropagation()
  event.preventDefault()

  if( !props.disabled ) {
    emit('clicked', event)
  }
}
</script>
