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
      v-for="option in field?.values"
      :key="option.value"
      :value="option.value"
    >
      {{ field.translate ? $t(option.label) : option.label }}
    </option>
    <slot></slot>
  </select>
</template>

<script setup lang="ts">
type Props = {
  modelValue?: any
  field?: {
    values: Array<any>
  }
}

const props = defineProps<Props>()

const getValue = (value: any) => {
  return typeof value !== 'string'
    ? Object.keys(props.field?.values||{}).find((key: string) => value?._id === key)
    : value
}
</script>

<style scoped src="./sv-select.scss"></style>
