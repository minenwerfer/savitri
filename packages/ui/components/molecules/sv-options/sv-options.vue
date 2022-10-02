<template>
  <div
    class="options"
    :style="`
      --columns: ${columns||1};
      grid-template-columns: repeat(var(--columns), 1fr);
    `"
  >
    <sv-checkbox
      v-for="(option, index) in values"
      :key="`option-${index}`"

      v-model="modelValue"
      v-bind="{
        ...option,
        label: translate ? $t(option.label||'') : option.label,
        type,
        value: option.value,
        readOnly
      }"

      :class="`
        options__checkbox
        ${modelValue && 'options__checkbox--selected'}
      `"

      @update:modelValue="updateValue"
    ></sv-checkbox>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { SvCheckbox } from '../../..'

type Props = {
  modelValue: any
  values: any
  translate?: boolean
  type?: string
  readOnly?: boolean
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
