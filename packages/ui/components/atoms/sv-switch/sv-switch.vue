<template>
  <div class="switch-wrapper">
    <a
      v-clickable="{
        blocked: field?.readOnly
      }"

      :class="`
        switch
        ${modelValue && 'switch--active'}
        ${field?.readOnly && 'switch--readOnly'}
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

<script setup lang="ts">
import { computed } from 'vue'

type Props = {
  modelValue?: boolean
  field?: {
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

const valueLabel = computed(() => props.field?.values?.[props.modelValue?0:1])

const toggle = () => {
  if( !props.field?.readOnly ) {
    emit('change', !props.modelValue)
    emit('update:modelValue', !props.modelValue)
  }
}
</script>

<style scoped src="./sv-switch.scss"></style>
