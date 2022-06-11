<template>
  <div class="inline-flex" @click="update">
    <slot></slot>

    <div class="absolute left-4 bottom-1" v-if="last > modelValue">
      <div class="grid place-items-center w-5 h-5 rounded-full bg-red-500 text-white text-xs">
        <div class="text-white text-sm">
          {{ text || (last - modelValue) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  last: number
  text?: string
  modelValue: any
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value:any): void
}>()

const update = () => {
  emit('update:modelValue', props.last)
}
</script>
