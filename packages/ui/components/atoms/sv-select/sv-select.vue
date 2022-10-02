<template>
  <select
    ref="select"
    class="select"

    :key="modelValue"
    :value="getValue(modelValue)"
    @click.stop="void"
    @change="$emit('update:modelValue', $event.target.value)"
  >
    <slot></slot>
  </select>
</template>

<script setup lang="ts">
type Props = {
  modelValue?: any
  values?: any
}

const props = defineProps<Props>()

const getValue = (value: any) => {
  return typeof value !== 'string'
    ? Object.keys(props.values||{}).find((key: string) => value?._id === key)
    : value
}
</script>

<style scoped src="./sv-select.scss"></style>
