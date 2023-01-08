<template>
  <div class="switch-wrapper">
    <a
      v-clickable="{
        blocked: property.readOnly
      }"

      :class="`
        switch
        ${modelValue && 'switch--active'}
        ${property.readOnly && 'switch--readOnly'}
      `"
      @click.stop="toggle"
    >
      <div class="switch__slider"></div>
      <div :class="`
        switch__dummy
        ${!modelValue && 'switch__dummy--flex'}
      `"></div>
    </a>

    <div>
      {{ property.description || propertyName }}
    </div>
  </div>
</template>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<script setup lang="ts">
import type { CollectionProperty } from '@semantic-api/types'

type Props = {
  modelValue: any
  property: CollectionProperty
  propertyName?: string
}

type Emits = {
  (e: 'update:modelValue' | 'change', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const property = props.property

const toggle = () => {
  if( !props.property.readOnly ) {
    emit('change', !props.modelValue)
    emit('update:modelValue', !props.modelValue)
  }
}
</script>

<style scoped src="./sv-switch.scss"></style>
