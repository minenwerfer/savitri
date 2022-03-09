<template>
  <a :class="`
    block overflow-hidden bg-white
    border shadow-md rounded-xl
    ${ disabled ? 'filter grayscale' : 'transition-all transform hover:translate-y-0.5 hover:shadow-none' }
  `">
    <div class="overflow-hidden select-none">
      <slot name="content"></slot>
    </div>
    <div class="relative px-3 pt-4 pb-2" v-if="$slots.bottom">
      <slot name="bottom"></slot>
    </div>
  </a>
</template>

<script setup lang="ts">
const props = defineProps<{
  disabled?: boolean
}>()
</script>
