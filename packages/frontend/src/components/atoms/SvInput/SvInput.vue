<template>
  <label class="outline-none select-none">
    <strong class="text-xs uppercase">
      <slot v-if="$slots.default"></slot>
      <slot v-else name="label"></slot>
    </strong>
    <div class="text-sm opacity-50" v-if="$slots.description">
      <slot name="description"></slot>
    </div>
    <div v-if="type !== 'textbox'" class="relative">
      <input
        :class="style === 'light' ? classesLight : classesNormal"

        ref="input"
        :type="type !== 'datetime' ? type : 'text'"
        :value="inputValue || value"
        :placeholder="placeholder"
        @input="onInput"
        @change="onChange"

        v-maska="mask"
        :readonly="readonly"
      />
      <div class="absolute left-0 top-0" v-if="icon">
        <unicon :name="icon" class="opacity-80"></unicon>
      </div>
    </div>


    <textarea
      v-else
      :class="`${classesNormal} h-36`"
      :placeholder="placeholder"

      @input="$emit('update:modelValue', $event.target.value)"
      :readonly="readonly"

    >{{ inputValue || value }}</textarea>
    </label>
</template>

<script setup lang="ts">
import { ref, inject, computed } from 'vue'
import { maska as vMaska } from 'maska'

const props = defineProps<{
  modelValue?: string
  value?: string
  type?: string
  placeholder?: string
  mask?: string
  icon?: string
  style?: string
  readonly?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', event: any): void
}>()

const input = ref<any>(null)
const style = inject('inputStyle', props.style)

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

const inputValue = computed(() => props.type === 'datetime'
  ? dateToISO(props.modelValue)
  : props.modelValue)

const classesNormal = computed(() => `
    w-full
    border-box rounded
    border border-stone-300 focus:border-purple-500
    bg-white px-3 py-1
    text-gray-600 outline-none
    ${props.icon && 'pl-8'}
    ${props.readonly && 'bg-stone-50'}
`)

const classesLight = computed(() => `
    w-full
    border-box 
    border-b border-stone-400 focus:border-purple-500
    bg-transparent pb-1
    text-gray-600 outline-none
    ${props.icon && 'pl-8'}
    ${props.readonly && 'bg-stone-50'}
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
