<template>
  <select
    ref="select"
    class="select"

    :key="modelValue"
    :value="getValue(modelValue)"
    @click.stop="void"
    @change="$emit('update:modelValue', ($event.target as any).value)"
  >
    <option value="">{{ $t('none') }}</option>
    <option
      v-for="option in property?.enum"
      :key="option.value"
      :value="option.value"
    >
      {{ property.s$translate ? $t(option.label) : option.label }}
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
  property: CollectionProperty
}

const props = defineProps<Props>()

const getValue = (value: any) => {
  return typeof value !== 'string'
    ? Object.keys(props.property?.enum||{}).find((key: string) => value?._id === key)
    : value
}
</script>

<style scoped src="./sv-select.scss"></style>
