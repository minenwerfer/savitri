<template>
  <select
    ref="select"
    class="px-2 py-1 w-full border border-gray-300 active:border-purple-500 bg-gray-100"

    :key="modelValue"
    :value="getValue(modelValue)"
    @change="$emit('update:modelValue', $event.target.value)"
  >
    <slot></slot>
  </select>
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import { useModule } from '../../../frontend'

const props = defineProps<{
  modelValue?: any
  values?: any
}>()

const getValue = (value: any) => {
  return typeof value !== 'string'
    ? Object.keys(props.values||{}).find((key: string) => value?._id === key)
    : value
}
</script>
