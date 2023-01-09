<template>
  <div
    class="options"
    :style="`
      --columns: ${columns||1};
      grid-template-columns: repeat(var(--columns), 1fr);
    `"
  >
    <div
      v-for="(option, index) in property.enum"
      :key="`option-${index}`"

      :class="`
        options__checkbox
        ${modelValue && 'options__checkbox--selected'}
    `">
        <sv-checkbox
          :model-value="modelValue"
          v-bind="{
            value: option,
            property
          }"

          @update:model-value="updateValue"
        ></sv-checkbox>
      </div>
  </div>
</template>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import type { CollectionProperty } from '@semantic-api/types'
import { SvCheckbox } from '..'

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
