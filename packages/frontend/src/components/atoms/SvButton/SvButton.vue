<template>
  <sv-bare-button
    :class="`
      text-white text-center font-bold outline-none
      py-1 px-4 rounded-md transition-all delay-200 duration-150 ease-in-out transform ${disabled || 'hover:scale-95'}
      ${bgColorClasses[type||'success']} ${borderClasses[type||'success']} border-b-2 
    `"

    :disabled="disabled"
  >
    <slot></slot>
  </sv-bare-button>
</template>

<script setup lang="ts">
import { SvBareButton } from '..'

const props = defineProps<{
  type?: string
  disabled?: boolean
}>()

const bgColorClasses = {
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  critical: 'bg-red-500',
  neutral: 'bg-blue-500'
}

const borderClasses = {
  success: 'border-green-700',
  warning: 'border-yellow-700',
  critical: 'border-red-700',
  neutral: 'border-blue-700'
}
</script>

<style scoped>
@layer hover {
  .underline {
    text-decoration: none;
  }
}
</style>
