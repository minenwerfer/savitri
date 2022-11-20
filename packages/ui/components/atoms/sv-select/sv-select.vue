<template>
  <select
    ref="select"
    class="select"

    :key="modelValue"
    :value="getValue(modelValue)"
    @click.stop="void"
    @change="$emit('update:modelValue', $event.target.value)"
  >
    <option value="">{{ $t('none') }}</option>
    <option
      v-for="option in property?.values"
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
type Props = {
  modelValue?: any
  property?: {
    values: Array<any>
  }
}

const props = defineProps<Props>()

const getValue = (value: any) => {
  return typeof value !== 'string'
    ? Object.keys(props.property?.values||{}).find((key: string) => value?._id === key)
    : value
}
</script>

<style scoped src="./sv-select.scss"></style>
