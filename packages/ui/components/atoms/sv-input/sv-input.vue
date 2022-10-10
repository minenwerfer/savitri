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
      v-if="field.type !== 'textbox'"
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
          ${field.icon && 'input__input--icon'}
          ${readOnly && 'input__input--readOnly'}
        `"

        @maska="onInput($event, true)"
        @input="onInput"
        @change="onChange"
      />
      <sv-icon 
        v-if="field.icon"
        :name="field.icon"
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
  modelValue?: string|number|Date
  fieldName?: string
  field: {
    type?: string
    mask?: string|Array<string>
    icon?: string
    variant?: string
    readOnly?: boolean
    placeholder?: string
    min?: number
    max?: number
  }
}

const props = withDefaults(defineProps<Props>(), {
  field: {
    type: 'text'
  }
})

const name = props.fieldName
const searchOnly = inject('searchOnly', false)
const readOnly = !searchOnly && props.readOnly

const emit = defineEmits<{
  (e: 'input', value: string|number): void
  (e: 'update:modelValue', value: string|number): void
}>()

const input = ref(null)
const variant = inject('inputVariant', props.variant) || 'normal'

const {
  icon,
  mask,
  variant: _variant,
  readOnly: _readOnly,
  ...inputBind

} = props.field

inputBind.name = props.fieldName
inputBind.readonly = readOnly

if( inputBind.type === 'datetime' ) {
  inputBind.type = !searchOnly && props.field?.includeHours
    ? 'datetime-local'
    : 'date'
}

const _getDatetimeString = () => {
  return props.field?.includeHours
    ? props.modelValue.toISOString().split('T')[0]
    : props.modelValue
}

const inputValue = ref(
  props.modelValue instanceof Date
    ? _getDatetimeString()
    : props.modelValue || ''
)

const updateValue = (value: string|number) => {
  const newVal = (() => {
    switch( props.field?.type ) {
      case 'datetime': return new Date(value)
      default: return value
    }
  })()

  emit('input', newVal)
  emit('update:modelValue', newVal)
}

const onInput = (
  event: { target: { modelValue: string, dataset?: { maskRawValue: string } } },
  masked: boolean
) => {
  if( !masked && event.target.dataset?.maskRawValue ) {
    return
  }

  inputValue.value = event.target.value
  const newValue = masked
    ? event.target.dataset.maskRawValue
    : event.target.value
    
  if( props.type === 'number' && !newValue ) {
    updateValue(0)
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
