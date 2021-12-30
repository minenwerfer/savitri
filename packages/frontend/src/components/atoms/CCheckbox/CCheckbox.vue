<template>
  <div
    class="
    checkbox
    rounded
    bg-white
    py-2
    border
    flex
    items-center
    select-none
    "
    >
    <div class="px-2 w-8">
      <input
        ref="checkbox"
        type="checkbox"
        v-model="bindVal"
        @input="onInput"
        />
    </div>
    <div
      class="grid w-full border-l px-4 cursor-pointer"
      @click="onClick"
      >
      <div class="">
        <slot name="label" v-if="$slots.label"></slot>
      </div>
      <div class="opacity-80">
        <slot name="description" v-if="$slots.description"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'

const props = defineProps<{
  modelValue?: any
  required: boolean
  value: string|boolean
  array: boolean
  isRadio: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', event: string|string[]|boolean): void
}>()

const checkbox = ref<any>(null)

const onClick = () => {
  if( !props.required ) {
    checkbox.value.click()
  }
}

onMounted(() => {
  if( !props.modelValue ) {
    emit('update:modelValue', props.array ? [] : false)
  }
})

const bindVal = computed({
  get: () => {
    if( props.isRadio ) {
      return props.modelValue === props.value
    }

    return Array.isArray(props.modelValue)
      ? (props.modelValue as (string|boolean)[]).includes(props.value)
      : !!props.value
  },

  set: () => {
    if( props.isRadio ) {
      emit('update:modelValue', props.value)
      return
    }

    if( props.array || Array.isArray(props.modelValue) ) {
      emit('update:modelValue', !props.modelValue.includes(props.value)
        ? [ ...props.modelValue||[], props.value ]
        : props.modelValue.filter((v: any) => v !== props.value))
    } else {
      emit('update:modelValue', !(props.modelValue === true))
    }
  }
})
</script>
