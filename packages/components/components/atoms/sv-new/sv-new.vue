<template>
  <div class="new" @click="update">
    <slot></slot>
    <div class="new__circle" v-if="last > modelValue">
      {{ text || (last - modelValue) }}
    </div>
  </div>
</template>

<script setup lang="ts">
type Props = {
  last: number
  text?: string
  modelValue: any
}

interface Emits {
  (e: 'update:modelValue', value:any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const update = () => {
  emit('update:modelValue', props.last)
}
</script>

<style scoped src="./sv-new.scss"></style>
