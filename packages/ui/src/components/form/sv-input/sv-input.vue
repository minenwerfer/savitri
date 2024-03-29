<script setup lang="ts">
import type { FormFieldProps } from '../types'
import { ref, inject, watch, computed } from 'vue'
import { maska as vMaska } from 'maska'
import { useClipboard } from '@savitri/web'

import SvInfo from '../../sv-info/sv-info.vue'
import SvIcon from '../../sv-icon/sv-icon.vue'

type InputType = string|number|Date

type InputVariant =
  'normal'
  | 'bold'
  | 'light'

type Props = FormFieldProps<InputType> & {
  variant?: InputVariant
  bordered?: boolean
}

const props = defineProps<Props>()
const property = props.property||{} as Props['property']
const bordered = props.bordered || inject('inputBordered', false)

const searchOnly = inject('searchOnly', false)
const innerInputLabel = inject('innerInputLabel', false)
const readOnly = !searchOnly && property.readOnly

const copyToClipboard = useClipboard()

const emit = defineEmits<{
  (e: 'update:modelValue' | 'input', value: InputType): void
  (e: 'change', value: any): void
}>()

const input = ref(null)
const rerenderFixture = ref(0)
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
  type: (() => {
    if( ['number', 'integer'].includes(property.type!) ) {
      return 'number'
    }

    if( property.s$inputType ) {
      return property.s$inputType
    }

    switch( typeof props.modelValue ) {
      case 'string': return 'text'
      case 'number': return 'number'
      default: return 'text'
    }
  })(),
  placeholder: innerInputLabel
    ? property.description || props.propertyName
    : property.s$placeholder,
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
  try {
     return new Date(props.modelValue).toISOString().split('T').shift()
  } catch( e ) {
    return ''
  }
}

const inputValue = ref(
  ['date', 'date-time'].includes(inputBind.type)
    ? getDatetimeString()
    : props.modelValue || ''
)

const updateValue = (value: InputType) => {
  const newVal = (() => {
    if( inputBind.type === 'number' ) {
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
  event: (Event & { target: any }) | (Event & {
    target: {
      value: string,
      dataset?: {
        maskRawValue: string
      }
    }
  }),
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

watch(() => props.modelValue, (value, oldValue) => {
  if( oldValue && !value ) {
    inputValue.value = property.type === 'number'
      ? 0
      : ''

    if( property.s$mask ) {
      rerenderFixture.value += 1
    }
  }
})
</script>

<template>
  <label :key="rerenderFixture" class="input">
    <div class="input__label" v-if="!innerInputLabel">
      <slot v-if="$slots.default"></slot>
      <slot v-else name="description"></slot>
    </div>
    <div v-if="$slots.hint" class="input__hint">
      <slot name="hint"></slot>
    </div>
    <div
      v-if="property.s$element !== 'textarea'"
      :class="`
        input__container
        input__container--${variant}
        ${bordered && 'input__container--bordered'}
    `">
      <input
        v-maska="mask"
        v-bind="inputBind"
        v-focus="rerenderFixture > 0 || property.s$focus"
        ref="input"
        :value="inputValue"
        data-component="input"

        :class="`
          input__input
          input__input--${variant}
          ${icon && 'input__input--icon'}
          ${readOnly && 'input__input--readOnly'}
        `"

        @maska="onInput($event, true)"
        @input="onInput"
        @change="emit('change', $event)"
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
            @click="copyToClipboard(modelValue)"
          ></sv-icon>
        </sv-info>
      </div>
    </div>

    <div
      v-else
      :class="`
        input__container
        input__container--${variant}
        ${bordered && 'input__container--bordered'}
    `">
      <textarea
        v-focus="rerenderFixture > 0 || property.s$focus"
        :placeholder="inputBind.placeholder"
        :readonly="readOnly"

        :class="`
          input__textarea
          input__input--${variant}
        `"

        @input="onInput"
      >{{ modelValue }}</textarea>
    </div>
  </label>
</template>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<style scoped src="./sv-input.scss"></style>
