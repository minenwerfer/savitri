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

<script>
import { ref } from 'vue'

export default {
  setup() {
    return {
      visible: ref(false)
    }
  }
}
</script>
