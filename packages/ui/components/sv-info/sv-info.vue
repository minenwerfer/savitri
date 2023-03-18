<template>
  <div
    class="info"
    @mouseleave="visible = false
  ">
    <div
      v-if="visible"
      :class="`
        info__bubble
        info__bubble--${where}
    `">
      <div class="info__content">
        <slot name="text"></slot>
      </div>
      <div :class="`
        info__arrow
        info__arrow--${where}
      `"></div>
    </div>
    <div @mouseover="visible = true">
      <slot v-if="$slots.default" name="default"></slot>
      <slot v-else></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

type Props = {
  where?: string
}

const props = defineProps<Props>()

const visible = ref(false)
const where = props.where || 'top'
</script>

<style scoped src="./sv-info.scss"></style>
