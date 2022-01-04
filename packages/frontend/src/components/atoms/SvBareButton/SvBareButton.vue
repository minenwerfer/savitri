<template>
  <a
    :class="`
      hover:underline
      inline-block select-none
      ${
        !disabled
          ? 'cursor-pointer'
          : 'cursor-not-allowed opacity-50'
      }
      `"
    @click="onClick"
  >
    <slot></slot>
  </a>
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
