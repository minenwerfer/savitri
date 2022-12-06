<template>
  <div
    class="options"
    :style="`
      --columns: ${columns||1};
      grid-template-columns: repeat(var(--columns), 1fr);
    `"
  >
    <sv-checkbox
      v-for="(option, index) in property?.enum"
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
import type { CollectionProperty } from '../../../../types'
import { SvCheckbox } from '../../..'

type Props = {
  modelValue: any
  columns?: number
  property?: CollectionProperty
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
