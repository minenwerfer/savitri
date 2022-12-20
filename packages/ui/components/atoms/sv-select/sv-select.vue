<template>
  <select
    ref="select"
    class="select"

    :key="modelValue"
    :value="getValue(modelValue)"
    @click.stop="void"
    @change="update(($event.target as any).value)"
  >
    <option value="">{{ $t('none') }}</option>
    <option
      v-for="option in property?.enum"
      :key="option"
      :value="option"
    >
      {{ property?.s$translate ? $t(option) : option }}
    </option>
    <slot></slot>
  </select>
</template>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<script setup lang="ts">
import type { CollectionProperty } from '../../../../types'

type Props = {
  modelValue?: any
  property?: CollectionProperty
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue'|'change', value: any): void
}>()

const property = props.property

const update = (value: any) => {
  emit('update:modelValue', value)
  emit('change', value)
}

const getValue = (value: any) => {
  return typeof value !== 'string'
    ? Object.keys(props.property?.enum||{}).find((key: string) => value?._id === key)
    : value
}
</script>

<style scoped src="./sv-select.scss"></style>
