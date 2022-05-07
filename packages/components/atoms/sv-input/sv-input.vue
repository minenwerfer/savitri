<template>
  <label class="outline-none select-none">
    <strong class="text-xs uppercase">
      <slot v-if="$slots.default"></slot>
      <slot v-else name="label"></slot>
    </strong>
    <div class="text-sm opacity-50" v-if="$slots.description">
      <slot name="description"></slot>
    </div>
    <div v-if="type !== 'textbox'" class="relative flex">
      <input
        :class="classes[variant]"

        ref="input"
        :type="type !== 'datetime' ? type : 'text'"
        :value="inputValue || value"
        :placeholder="placeholder"
        @input="onInput"
        @change="onChange"

        v-maska="mask"
        :readonly="readonly"
      />
      <div 
        v-if="icon"
        :class="
          variant !== 'light'
            ? 'absolute top-[58%] left-2 transform -translate-y-1/2'
            : 'absolute top-0 left-0'
        "
      >
        <sv-icon :name="icon" fill="gray"></sv-icon>
      </div>

      <div
        v-if="readonly"
        class="flex items-center border border-stone-300 transform -translate-x-1 bg-white px-1"
      >
        <sv-info>
          <template #text>Copiar</template>
          <sv-bare-button @clicked="copy(inputValue || value)">
            <sv-icon name="clipboard" fill="gray" class="w-5 h-5"></sv-icon>
          </sv-bare-button>
        </sv-info>
      </div>
    </div>


    <textarea
      v-else
      :class="`${classes[variant]} h-36`"
      :placeholder="placeholder"

      @input="$emit('update:modelValue', $event.target.value)"
      :readonly="readonly"

    >{{ inputValue || value }}</textarea>
  </label>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'
import { useStore } from 'vuex'
import { maska as vMaska } from 'maska'
import { copyToClipboard } from '../../../frontend/src/helpers'
import {
  SvBareButton,
  SvInfo,
  SvIcon

} from '../../'

const props = defineProps<{
  modelValue?: string
  value?: string|number
  type?: string
  placeholder?: string
  mask?: string
  icon?: string
  variant?: string
  readonly?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', event: any): void
}>()

const store = useStore()

const input = ref<any>(null)
const variant = inject('inputVariant', props.variant) || 'normal'

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

const classes ={
  normal: `
    w-full border-box rounded
    border border-stone-300 focus:border-gray-600 focus:shadow
    bg-white px-3 py-1
    text-gray-600 outline-none
    ${props.icon && 'pl-8'}
    ${props.readonly && 'bg-stone-50'}
  `,

  light: `
    w-full border-box 
    border-b border-stone-400 focus:border-gray-600 focus:shadow
    bg-transparent pb-1
    text-gray-600 outline-none
    ${props.icon && 'pl-8'}
    ${props.readonly && 'bg-stone-50'}
  `,

  bold: `
    w-full border-box rounded
    border border-gray-300 py-2 focus:border-gray-600 focus:shadow
    outline-none px-3
    ${props.icon && 'pl-10'}
    ${props.readonly ? 'bg-stone-50' : 'bg-white'}
  `
}

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

const copy = (value: string) => {
  copyToClipboard(value)
  store.dispatch('meta/spawnToast', {
    text: 'Copiado!'
  })
}
</script>
