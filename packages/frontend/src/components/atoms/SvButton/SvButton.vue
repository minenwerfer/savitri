<template>
  <sv-bare-button
    :class="classes[variant]"
    :disabled="disabled"
  >
    <slot></slot>
  </sv-bare-button>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { SvBareButton } from '..'

const props = defineProps<{
  type?: string
  variant?: string
  disabled?: boolean
}>()

const variant = inject('variant', props.variant) || 'normal'

const bgColorClasses = {
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  critical: 'bg-red-500',
  neutral: 'bg-blue-500'
}

const borderClasses = {
  success: 'border-purple-700',
  warning: 'border-yellow-700',
  critical: 'border-red-700',
  neutral: 'border-blue-700'
}

const textClasses = {
  success: 'text-purple-700',
  warning: 'text-yellow-700',
  critical: 'text-red-700',
  neutral: 'text-blue-700'
}

const classes = {
  normal: `
    text-white text-center font-bold outline-none
    py-1 px-6 rounded transition-all delay-200 duration-150 ease-in-out transform
    ${props.disabled || 'hover:scale-95'}
    ${bgColorClasses[props.type||'success']}
  `,

  light: `
    border
    py-1 px-6 rounded transition-all duration-100 ease-in-out transform
    ${props.disabled || 'hover:bg-purple-500 hover:text-white'}
    ${borderClasses[props.type||'success']} ${textClasses[props.type||'success']}
  `
}
</script>

<style scoped>
@layer hover {
  .underline {
    text-decoration: none;
  }
}
</style>
