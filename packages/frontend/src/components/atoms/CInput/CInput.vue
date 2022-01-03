<template>
  <label class="outline-none select-none">
    <div class="opacity-80">
      <slot v-if="$slots.default"></slot>
      <slot v-else name="label"></slot>
    </div>
    <div class="text-sm opacity-50" v-if="$slots.description">
      <slot name="description"></slot>
    </div>
    <input
      class="
        w-full
        border-box rounded
        border border-gray-400
        bg-white
        px-3 py-1
        text-gray-600
      "
      ref="input"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      @input="onInput"
      @change="onChange"

      v-maska="mask"
    />
  </label>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { maska as vMaska } from 'maska'

const props = defineProps<{
  modelValue?: string
  type?: string
  placeholder?: string
  mask?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', event: any): void
}>()

const input = ref<any>(null)

const onInput = (event: { target: { value: string } }) => {
  emit('update:modelValue', event.target.value)
}

const onChange = (event: { target: { value: string } }) => {
  input.value.value = event.target.value
}
</script>
