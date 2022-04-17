<template>
  <div class="relative" @mouseover="visible = true" @mouseleave="visible = false">
    <div :class="`absolute ${textPosition} animate-fade`" v-if="visible">
      <div class="bg-black text-white text-sm font-semibold rounded-lg py-2 px-4 whitespace-nowrap text-center">
        <slot name="text"></slot>
      </div>
      <div :class="`absolute bg-black text-white ${arrowPosition} w-3 h-3 rotate-45`"></div>
    </div>
    <slot name="default" v-if="$slots.default"></slot>
    <slot v-else></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  where?: string
}>()

const visible = ref(false)

const textPosition = computed(() => {
  switch(props.where) {
    case 'left': return '-top-1/2 right-[100%] transform translate-y-1/2'
    case 'bottom': return '-bottom-[2.3em] left-1/2 transform -translate-x-1/2'
    case 'topleft': return '-top-[3em] right-[100%]'
    case 'top': default: return '-top-[3em] left-1/2 transform -translate-x-1/2'
  }
})

const arrowPosition = computed(() => {
  switch(props.where) {
    case 'left': return 'top-1/2 -right-[.4em] transform -translate-y-1/2'
    case 'bottom': return '-top-[.4em] left-1/2 transform -translate-x-1/2'
    case 'topleft': return '-bottom-[.4em] left-1/2 transform -translate-x-1/2'
    case 'top': default: return '-bottom-[.4em] left-1/2 transform -translate-x-1/2'
  }
})
</script>
