<template>
  <label class="outline-none select-none">
    <strong class="text-xs uppercase">
      <slot v-if="$slots.default"></slot>
      <slot v-else name="label"></slot>
    </strong>
    <div class="text-sm opacity-50" v-if="$slots.description">
      <slot name="description"></slot>
    </div>
    <input
      v-if="type !== 'textbox'"
      :class="classes"

      ref="input"
      :type="type !== 'datetime' ? type : 'text'"
      :value="inputValue || value"
      :placeholder="placeholder"
      @input="onInput"
      @change="onChange"

      v-maska="mask"
      :readonly="readonly"
    />


    <textarea
      v-else
      :class="`${classes} h-48`"
      :placeholder="placeholder"

      @input="$emit('update:modelValue', $event.target.value)"
      :readonly="readonly"

    >{{ value }}</textarea>
    </label>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { maska as vMaska } from 'maska'

const props = defineProps<{
  modelValue?: string
  value?: string
  type?: string
  placeholder?: string
  mask?: string
  readonly?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', event: any): void
}>()

const input = ref<any>(null)

const dateToISO = (raw: string) => {
  if( !raw ) {
    return ''
  }

  const numbers = raw.split('T')[0].split('-').join('')

  return [
    numbers.slice(6, 8),
    numbers.slice(4, 6),
    numbers.slice(0, 4)

  ].join('/')
}

const ISOToDate = (raw: string) => {
  if( !raw ) {
    return
  }

  const numbers = raw.split('/').join('')

  return [
    numbers.slice(2, 4),
    numbers.slice(0, 2),
    numbers.slice(4, 8)

  ].join('/')
}

const inputValue = ref(props.type === 'datetime'
  ? dateToISO(props.modelValue)
  : props.modelValue)

const classes = computed(() => `
    w-full
    border-box rounded
    border-2 border-gray-300 focus:border-purple-500
    bg-white
    px-3 py-1
    text-gray-600 outline-none
    ${props.readonly ? 'bg-gray-100' : ''}
`)

const onInput = (event: { target: { value: string, dataset?: { maskRawValue: string } } }) => {
  inputValue.value = event.target.value
  const newValue = props.type !== 'datetime'
    ? event.target.dataset?.maskRawValue || event.target.value
    : event.target.value

  emit('update:modelValue', newValue)
}

const onChange = (event: { target: { value: string } }) => {
  if( props.type === 'datetime' ) {
    emit('update:modelValue', ISOToDate(event.target.value))
  }
}
</script>
