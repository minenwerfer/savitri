<template>
  <sv-bare-button
    :class="`_button transition-all ${classes[variant]}`"
    :disabled="disabled"
  >
    <div class="flex items-start justify-center gap-x-2" v-if="icon">
      <sv-icon
        v-if="icon"
        :name="icon"
        :class="`
          w-5 h-5
          ${!disabled && '_icon'}
          ${variant === 'light' ? fillClasses[type||'success'] : 'fill-white'}
        `"
      ></sv-icon>
      <slot></slot>
    </div>

    <slot v-else></slot>
  </sv-bare-button>
</template>

<script setup lang="ts">
import { inject, computed } from 'vue'
import {
  SvBareButton,
  SvIcon

} from '..'

const props = defineProps<{
  type?: string
  icon?: string
  variant?: string
  disabled?: boolean
}>()

const variant = inject('buttonVariant', props.variant) || 'normal'

const bgColorClasses = {
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  critical: 'bg-red-500',
  neutral: 'bg-blue-500'
}

const bgHoverColorClasses = {
  success: 'hover:bg-purple-500',
  warning: 'hover:bg-yellow-500',
  critical: 'hover:bg-red-500',
  neutral: 'hover:bg-blue-500'
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

const fillClasses = {
  success: 'fill-purple-700',
  warning: 'fill-yellow-700',
  critical: 'fill-red-700',
  neutral: 'fill-blue-700'
}

const classes = computed(() => ({
  normal: `
    text-white text-center font-bold outline-none
    py-1 px-4 rounded delay-200 duration-150 ease-in-out filter
    ${!!props.disabled || 'hover:brightness-90'}
    ${bgColorClasses[props.type||'success']}
  `,

  light: `
    border whitespace-nowrap
    py-1 px-4 rounded transition-none
    ${!!props.disabled || bgHoverColorClasses[props.type||'success'] + ' hover:text-white'}
    ${borderClasses[props.type||'success']} ${textClasses[props.type||'success']}
  `
}))
</script>

<style scoped>
@layer hover {
  .underline {
    text-decoration: none;
  }
}

._button:hover >>> ._icon {
  @apply fill-white;
}
</style>
