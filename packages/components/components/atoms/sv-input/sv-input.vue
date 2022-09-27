<template>
  <label class="input">
    <strong class="input__label">
      <slot v-if="$slots.default"></slot>
      <slot v-else name="label"></slot>
    </strong>
    <div v-if="$slots.description" class="input__description">
      <slot name="description"></slot>
    </div>
    <div
      v-if="type !== 'textbox'"
      :class="`
        input__container
        input__container--${variant}`
    ">
      <input
        v-maska="mask"
        v-bind="inputBind"
        ref="input"
        :value="inputValue"

        :class="`
          input__input
          input__input--${variant}
          ${icon && 'input__input--icon'}
          ${readOnly && 'input__input--readOnly'}
        `"

        @maska="onInput($event, true)"
        @input="onInput"
        @change="onChange"
      />
      <sv-icon 
        v-if="icon"
        :name="icon"
        :class="`
          input__icon
          input__icon--${variant}
      `"></sv-icon>

      <div
        v-if="readOnly"
        class="input__clipboard"
      >
        <sv-info>
          <template #text>Copiar</template>
          <sv-icon
            v-clickable
            name="clipboard"
            @click="copyToCipboard(modelValue)"
          ></sv-icon>
        </sv-info>
      </div>
    </div>


    <textarea
      v-else
      :placeholder="placeholder"
      :readonly="readOnly"

      :class="`
        input__textarea
        input__input--${variant}
      `"

      @input="updateValue($event.target.value)"
    >{{ modelValue }}</textarea>
  </label>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'
import { maska as vMaska } from 'maska'
import { copyToClipboard } from '@savitri/web'
import { SvInfo, SvIcon } from '../..'

type Props = {
  name?: string
  type?: string
  modelValue?: string|number
  mask?: string|Array<string>
  icon?: string
  variant?: string
  readOnly?: boolean
  placeholder?: string
  min?: number
  max?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text'
})

const emit = defineEmits<{
  (e: 'input', value: string|number): void
  (e: 'update:modelValue', value: string|number): void
}>()

const input = ref(null)
const variant = inject('inputVariant', props.variant) || 'normal'

const {
  modelValue,
  ...inputBind

} = props

const inputValue = ref(props.modelValue||'')

// const dateToISO = (raw: string) => {
//   if( !raw ) {
//     return ''
//   }
// 
//   const numbers = raw.split('T')[0].split('-').join('')
// 
//   return [
//     numbers.slice(6, 8),
//     numbers.slice(4, 6),
//     numbers.slice(0, 4)
// 
//   ].join('/')
// }
// 
// const ISOToDate = (raw: string) => {
//   if( !raw ) {
//     return
//   }
// 
//   const numbers = raw.split('/').join('')
// 
//   return [
//     numbers.slice(2, 4),
//     numbers.slice(0, 2),
//     numbers.slice(4, 8)
// 
//   ].join('/')
// }

// const inputValue = ref(props.type === 'datetime'
//   ? dateToISO(props.modelValue)
//   : props.modelValue)

const updateValue = (value: string|number) => {
  emit('input', value)
  emit('update:modelValue', value)
}

const onInput = (
  event: { target: { modelValue: string, dataset?: { maskRawValue: string } } },
  masked:boolean
) => {
  if( !masked && event.target.dataset?.maskRawValue ) {
    return
  }

  inputValue.value = event.target.value
  const newValue = masked
    ? event.target.dataset.maskRawValue
    : event.target.value
    
  if( !newValue ) {
    updateValue('')
    return
  }

  updateValue(newValue)
}

const onChange = (event: { target: { modelValue: string } }) => {
  if( props.type === 'datetime' ) {
    emit('update:modelValue', ISOToDate(event.target.modelValue))
  }
}
</script>

<style scoped src="./sv-input.scss"></style>
