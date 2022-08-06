<template>
  <label class="input">
    <strong class="input__label">
      <slot v-if="$slots.default"></slot>
      <slot v-else name="label"></slot>
    </strong>
    <div v-if="$slots.description" class="input__description">
      <slot name="description"></slot>
    </div>
    <div v-if="type !== 'textbox'" :class="`input__container input__container--${variant}`">
      <input
        v-maska="mask"
        :class="`
          input__input
          input__input--${variant}
          ${icon && 'input__input--icon'}
          ${readOnly && 'input__input--readonly'}
        `"

        ref="input"
        :type="type !== 'datetime' ? type : 'text'"
        :value="inputValue || value"
        :placeholder="placeholder"
        :readonly="readOnly"
        :min="min"
        :max="max"

        @input="onInput"
        @change="onChange"
      />
      <sv-icon 
        v-if="icon"
        :name="icon"
        :class="`input__icon input__icon--${variant}`"
      ></sv-icon>

      <div
        v-if="readOnly"
        class="input__clipboard"
      >
        <sv-info>
          <template #text>Copiar</template>
          <sv-bare-button @clicked="copy(inputValue || value)">
            <sv-icon name="clipboard" fill="gray"></sv-icon>
          </sv-bare-button>
        </sv-info>
      </div>
    </div>


    <textarea
      v-else
      :class="`input__textarea input__input--${variant}`"
      :placeholder="placeholder"

      @input="$emit('update:modelValue', $event.target.value)"
      :readonly="readOnly"

    >{{ inputValue || value }}</textarea>
  </label>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'
import { maska as vMaska } from 'maska'
import { useStore, copyToClipboard } from '@savitri/web'
import {
  SvBareButton,
  SvInfo,
  SvIcon

} from '../../'

type Props = {
  modelValue?: string
  value?: string|number
  type?: string
  placeholder?: string
  mask?: string|Array<string>
  icon?: string
  variant?: string
  readOnly?: boolean
  min?: number
  max?: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', event: any): void
}>()

const metaStore = useStore('meta')

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
  metaStore.spawnToast({
    text: 'Copiado!'
  })
}
</script>

<style scoped src="./sv-input.scss"></style>
