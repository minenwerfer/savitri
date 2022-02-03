<template>
  <select
    ref="select"
    class="p-2 w-full"

    :key="modelValue"
    :value="getValue(modelValue)"
    @change="$emit('update:modelValue', $event.target.value)"
  >
    <slot></slot>
  </select>
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import useModule from 'frontend/composables/module'

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
