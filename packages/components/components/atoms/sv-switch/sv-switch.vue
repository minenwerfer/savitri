<template>
  <div class="switch-wrapper">
    <a
      v-clickable="{
        blocked: readOnly
      }"

      :class="`
        switch
        ${modelValue && 'switch--active'}
        ${readOnly && 'switch--readOnly'}
      `"
      @click.stop="toggle"
    >
      <div class="switch__slider"></div>
      <div :class="`
        switch__dummy
        ${!modelValue && 'switch__dummy--flex'}
      `"></div>
    </a>

    <div v-if="values">
      <slot :label="valueLabel"></slot>
    </div>
    <slot v-else-if="$slots.default"></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Props = {
  modelValue?: boolean
  values?: Array<string>
  readOnly?: boolean
}

type Emits = {
  (e: 'change', value: boolean): void
  (e: 'update:modelValue', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const valueLabel = computed(() => props.values?.[props.modelValue?0:1])

const toggle = () => {
  if( !props.readOnly ) {
    emit('change', !props.modelValue)
    emit('update:modelValue', !props.modelValue)
  }
}
</script>

<style scoped src="./sv-switch.scss"></style>
