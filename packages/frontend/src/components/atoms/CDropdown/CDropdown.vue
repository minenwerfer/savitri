<template>
  <div class="relative">
    <div
      @click="visible = !visible"
      class="absolute top-0 right-0 cursor-pointer z-40"
    >
      <slot name="trigger"></slot>
    </div>
    <div v-if="visible" class="mr-6">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
</script>
