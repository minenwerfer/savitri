<template>
  <div class="switch-wrapper">
    <a
      v-clickable="{
        blocked: property?.readOnly
      }"

      :class="`
        switch
        ${modelValue && 'switch--active'}
        ${property?.readOnly && 'switch--readOnly'}
      `"
      @click.stop="toggle"
    >
      <div class="switch__slider"></div>
      <div :class="`
        switch__dummy
        ${!modelValue && 'switch__dummy--flex'}
      `"></div>
    </a>

    <slot :label="valueLabel"></slot>
  </div>
</template>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

type Props = {
  modelValue?: boolean
  property?: {
    values: Array<string>
    readOnly?: boolean
  }
}

type Emits = {
  (e: 'change', value: boolean): void
  (e: 'update:modelValue', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const valueLabel = computed(() => props.property?.values?.[props.modelValue?0:1])

const toggle = () => {
  if( !props.property?.readOnly ) {
    emit('change', !props.modelValue)
    emit('update:modelValue', !props.modelValue)
  }
}
</script>

<style scoped src="./sv-switch.scss"></style>
