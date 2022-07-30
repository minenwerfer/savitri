<template>
  <div class="info" @mouseleave="visible = false">
    <div :class="`info__bubble info__bubble--${where}`" v-if="visible">
      <div class="info__content">
        <slot name="text"></slot>
      </div>
      <div :class="`info__arrow info__arrow--${where}`"></div>
    </div>
    <div class="info__trigger">
      <div @mouseover="visible = true">
        <slot name="default" v-if="$slots.default"></slot>
        <slot v-else></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

type Props = {
  where?: string
}

const props = defineProps<Props>()

const visible = ref(false)
const where = props.where || 'top'
</script>

<style scoped src="./sv-info.scss"></style>
