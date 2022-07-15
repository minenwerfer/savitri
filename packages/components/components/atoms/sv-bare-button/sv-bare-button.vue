<template>
  <button
    :class="`
      barebutton
      barebutton--${disabled ? 'disabled' : 'enabled'}
    `"
    @click="onClick"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
interface Props {
  disabled?: boolean
}

const props = defineProps<Props>()

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

<style scoped src="./sv-bare-button.scss"></style>
