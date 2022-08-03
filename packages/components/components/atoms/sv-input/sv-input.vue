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
        :type="inputType(type)"
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

type InputType = 
  | 'text' 
  | 'password'
  | 'number'
  | 'date'
  | 'datetime' // datetime-local
  | 'email'

type Props = {
  modelValue?: string
  value?: string | number
  type?: InputType
  placeholder?: string
  mask?: string
  icon?: string
  variant?: string
  readOnly?: boolean
  min?: number
  max?: number
}

const inputType = (typ: InputType): string => {
  switch (typ) {
    case 'datetime': return 'datetime-local'
    default: return typ
  }
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', event: any): void
}>()

const metaStore = useStore('meta')

const input = ref<any>(null)
const variant = inject('inputVariant', props.variant) || 'normal'

const inputValue = ref(props.modelValue)

const onInput = (event: { target: { value: string, dataset?: { maskRawValue: string } } }) => {
  inputValue.value = event.target.value
  emit('update:modelValue', event.target.dataset?.maskRawValue || event.target.value)
}

const onChange = (event: { target: { value: string } }) => {
  emit('update:modelValue', event.target.value)
}

const copy = (value: string) => {
  copyToClipboard(value)
  metaStore.spawnToast({
    text: 'Copiado!'
  })
}
</script>

<style scoped src="./sv-input.scss"></style>
