<template>
  <label :class="`
    checkbox
    ${property.readOnly && 'checkbox--readOnly'}
  `">
    <input
      v-model="bindVal"
      ref="checkbox"
      v-bind="{
        type,
        readOnly: property.readOnly,
        checked: bindVal
      }"
io
      class="checkbox__input"
    />
    <div
      v-clickable
      class="checkbox__text"
    >
      <div class="checkbox__label">
        <slot name="label" v-if="$slots.label"></slot>
        <div v-else-if="label" v-html="label"></div>
        <slot v-else></slot>
      </div>
      <div class="checkbox__description">
        <slot name="description" v-if="$slots.description"></slot>
        <div v-else-if="description" v-html="description"></div>
      </div>
    </div>
  </label>
</template>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { CollectionProperty } from '../../../../types'

type Props = {
  modelValue?: string|Array<string>|boolean
  value?: string|boolean
  label?: string
  description?: string
  property: CollectionProperty
}

const props = defineProps<Props>()
const type = props.property.type === 'array'
  ? 'checkbox'
  : 'radio'

const emit = defineEmits<{
  (e: 'update:modelValue' | 'change', value: Props['modelValue']): void
}>()

const checkbox = ref<any>(null)

const value = typeof props.value === 'object'
  ? ((props.value as any)?._id || props.value)
  : props.value

const selectedValues = (values: Array<Props['modelValue']>): (string|boolean)[] => {
  return values.map((v: any) => v._id || v)
}

const bindVal = computed({
  get: () => {
    if( !props.modelValue ) {
      return false
    }

    if( props.property.type !== 'array' ) {
      return props.modelValue === props.value
    }

    return Array.isArray(props.modelValue)
      ? selectedValues(props.modelValue).includes(props.value as string)
      : !!props.value
  },

  set: () => {
    if( props.property?.readOnly ) {
      return
    }

    if( props.property.type !== 'array' ) {
      emit('update:modelValue', value)
      return
    }

    const values = props.modelValue
      ? [props.modelValue]
      : []

    emit('update:modelValue', !selectedValues(values).includes(value)
      ? [ ...values, value ]
      : selectedValues(values).filter((v) => v !== value))
  }
})
</script>

<style scoped src="./sv-checkbox.scss"></style>
