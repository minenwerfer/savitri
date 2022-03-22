<template>
  <div class="relative" @mouseover="visible = true" @mouseleave="visible = false">
    <div :class="`absolute ${props.where === 'bottom' ? '-bottom-[3em]' : 'top-[-3em]'} left-1/2 transform -translate-x-1/2 animate-fade`" v-if="visible">
      <div class="bg-black text-white text-sm font-semibold rounded-lg py-2 px-4 whitespace-nowrap text-center">
        <slot name="text"></slot>
      </div>
      <div :class="`absolute bg-black text-white ${props.where === 'bottom' ? '-top-[.4em]' : '-bottom-[.4em]'} left-1/2 transform -translate-x-1/2 w-3 h-3 rotate-45`"></div>
    </div>
    <slot name="default" v-if="$slots.default"></slot>
    <slot v-else></slot>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  where?: string
}>()

const visible = ref(false)
</script>
