<template>
  <div
    class="options"
    :style="`
      --columns: ${columns||1};
      grid-template-columns: repeat(var(--columns), 1fr);
    `"
  >
    <sv-checkbox
      v-for="(option, index) in property.enum"
      :key="`option-${index}`"

      v-model="modelValue"
      v-bind="{
        ...option,
        property
      }"

      :class="`
        options__checkbox
        ${modelValue && 'options__checkbox--selected'}
      `"

      @update:model-value="updateValue"
    ></sv-checkbox>
  </div>
</template>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { SvCheckbox } from '..'
import type { CollectionProperty } from '../../../../types'

type Props = {
  modelValue: any
  property: CollectionProperty
  propertyName?: string
  columns?: number
}

type Emits = {
  (e: 'update:modelValue', value: any): void
}

const props = withDefaults(defineProps<Props>(), {
  columns: 1
})

const emit = defineEmits<Emits>()
const modelValue = computed(() => props.modelValue)

const updateValue = (value: any) => {
  emit('update:modelValue', value)
}
</script>

<style scoped src="./sv-options.scss"></style>
