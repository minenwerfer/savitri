<script setup lang="ts">
import type { CollectionProperty } from '@semantic-api/types'

type Props = {
  modelValue: any
  property?: CollectionProperty
  propertyName?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue'|'change', value: any): void
}>()

const property = props.property||{}

const update = (value: any) => {
  emit('update:modelValue', value?._id || value)
  emit('change', value?._id || value)
}
</script>

<template>
  <select
    ref="select"
    class="select"

    :key="modelValue?._id || modelValue"
    :value="modelValue?._id || modelValue"
    @click.stop="void"
    @change="update(($event.target as any).value)"
  >
    <option value="">{{ $t('none') }}</option>
    <option
      v-for="option in property.enum"
      :key="option"
      :value="option"
    >
      {{ property.s$translate ? $t(option) : option }}
    </option>
    <slot></slot>
  </select>
</template>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<style scoped src="./sv-select.scss"></style>
