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
      :class="`
        w-full
        border-box rounded
        border-2 border-gray-300 focus:border-purple-500
        bg-white
        px-3 py-1
        text-gray-600 outline-none
        ${readonly ? 'bg-gray-100' : ''}
      `"
      ref="input"
      :type="type"
      :value="modelValue || value"
      :placeholder="placeholder"
      @input="onInput"
      @change="onChange"

      v-maska="mask"
      :readonly="readonly"
    />
  </label>
</template>

<script setup lang="ts">
import { ref } from 'vue'
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

const onInput = (event: { target: { value: string } }) => {

  const formatDate = (value: string) => {
    return value
  }

  emit('update:modelValue', event.target.value)
}

const onChange = (event: { target: { value: string } }) => {
  input.value.value = event.target.value
}
</script>
