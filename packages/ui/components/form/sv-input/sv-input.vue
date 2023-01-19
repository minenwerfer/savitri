<template>
  <label class="input">
    <strong class="input__label">
      <slot v-if="$slots.default"></slot>
      <slot v-else name="description"></slot>
    </strong>
    <div v-if="$slots.hint" class="input__hint">
      <slot name="hint"></slot>
    </div>
    <div
      v-if="property.s$element !== 'textarea'"
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
      :placeholder="inputBind.placeholder"
      :readonly="readOnly"

      :class="`
        input__textarea
        input__input--${variant}
      `"

      @input="updateValue($event.target.value)"
    >{{ modelValue }}</textarea>
  </label>
</template>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<script setup lang="ts">
import { ref, inject } from 'vue'
import { maska as vMaska } from 'maska'
import type { CollectionProperty } from '@semantic-api/types'
import { useClipboard } from '../../../../web'
import { SvInfo, SvIcon } from '../..'

type InputType = string|number|Date

type Props = {
  modelValue: InputType
  property: CollectionProperty
  propertyName?: string
  variant?: string
}

const props = defineProps<Props>()
const property = props.property||{}

const searchOnly = inject('searchOnly', false)
const readOnly = !searchOnly && property.readOnly

const copyToClipboard = useClipboard()

const emit = defineEmits<{
  (e: 'update:modelValue' | 'input', value: InputType): void
}>()

const input = ref(null)
const variant = inject('inputVariant', props.variant) || 'normal'

const {
  s$icon: icon,
  s$mask: mask,
  readOnly: _readOnly,

} = property

const inputBind: {
  type: string
  placeholder?: string
  min?: number
  max?: number
  name?: string
  readonly?: boolean
} = {
  type: property.s$inputType||'text',
  placeholder: property.s$placeholder,
  min: property.minimum || property.exclusiveMinimum,
  max: property.maximum || property.exclusiveMaximum,
}

inputBind.name = props.propertyName
inputBind.readonly = readOnly

if( ['date', 'date-time'].includes(property.format!) ) {
  inputBind.type = !searchOnly && property.format === 'date-time'
    ? 'datetime-local'
    : 'date'
}

if( inputBind.type === 'text' && searchOnly ) {
  inputBind.type = 'search'
}

const getDatetimeString = () => {
   return (props.modelValue as Date).toISOString().split('T').shift()
}

const inputValue = ref(
  props.modelValue instanceof Date
    ? getDatetimeString()
    : props.modelValue || ''
)

const updateValue = (value: InputType) => {
  const newVal = (() => {
    if( property.type === 'number' ) {
      return Number(value)
    }

    switch( property.format ) {
      case 'date':
      case 'date-time':
        return new Date(value)
      default: return value
    }
  })()

  emit('input', newVal)
  emit('update:modelValue', newVal)
}

const onInput = (
  event: Event & {
    target: {
      value: string,
      dataset?: {
        maskRawValue: string
      }
    }
  },
  masked?: boolean
) => {
  if( !masked && event.target.dataset?.maskRawValue ) {
    return
  }

  inputValue.value = event.target.value
  const newValue = masked
    ? event.target.dataset?.maskRawValue
    : event.target.value
    
  if( property.type === 'number' && !newValue ) {
    updateValue(0)
    return
  }

  updateValue(newValue!)
}
</script>

<style scoped src="./sv-input.scss"></style>
