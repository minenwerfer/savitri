<template>
  <div class="relative">
    <div
      @click="visible = !visible"
      class="cursor-pointer z-40"
    >
      <slot name="trigger"></slot>
    </div>
    <div v-if="visible" class="mr-6">
      <sv-overlay :invisible="true" @click="visible = false"></sv-overlay>
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { SvOverlay } from '../../'

const visible = ref(false)
</script>
