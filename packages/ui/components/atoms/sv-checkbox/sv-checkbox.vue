<template>
  <label :class="`
    checkbox
    ${field.readOnly && 'checkbox--readOnly'}
  `">
    <input
      v-model="bindVal"
      ref="checkbox"
      v-bind="{
        type: field.type,
        readOnly: field.readOnly,
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

<script setup lang="ts">
import { computed, ref } from 'vue'

type Props = {
  modelValue?: any
  value?: string|boolean
  label?: string
  description?: string
  field?: {
    type?: string
    required?: boolean
    readOnly?: boolean
  }
}

const props = withDefaults(defineProps<Props>(), {
  type: 'checkbox'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string|Array<string>|boolean): void
  (e: 'change', value: string): void
}>()

const checkbox = ref<any>(null)

const onClick = () => {
  if( !props.field?.required && !props.field?.readOnly ) {
    checkbox.value.click()
  }
}

const value = typeof props.value === 'object'
  ? (props.value?._id || props.value)
  : props.value

const selectedValues = (values: Array<any>): (string|boolean)[] => {
  return values.map((v: any) => v._id || v)
}

const bindVal = computed({
  get: () => {
    if( !props.modelValue ) {
      return false
    }

    if( props.field?.type === 'radio' ) {
      return props.modelValue === props.value
    }

    return Array.isArray(props.modelValue)
      ? selectedValues(props.modelValue).includes(props.value)
      : !!props.value
  },

  set: (newVal: boolean) => {
    if( props.field?.readOnly ) {
      return
    }

    if( props.field?.type === 'radio' ) {
      emit('update:modelValue', value)
      return
    }

    const values = props.modelValue||[]

    emit('update:modelValue', !selectedValues(values).includes(value)
      ? [ ...values, value ]
      : selectedValues(props.modelValue).filter((v: any) => v !== value))
  }
})
</script>

<style scoped src="./sv-checkbox.scss"></style>
