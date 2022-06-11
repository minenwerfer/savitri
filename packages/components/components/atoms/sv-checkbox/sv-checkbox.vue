<template>
  <div
    :class="`
    rounded
    py-2 bg-white
    flex items-center
    select-none border
    ${readonly ? 'bg-gray-100' : ''}
    `"
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
        <div v-else-if="label" v-html="label"></div>
      </div>
      <div class="opacity-80">
        <slot name="description" v-if="$slots.description"></slot>
        <div v-else-if="description" v-html="description"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'

const props = defineProps<{
  modelValue?: any
  required?: boolean
  label?: string
  description?: string
  value: string|boolean
  array?: boolean
  isRadio?: boolean
  readonly?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', event: string|string[]|boolean): void
}>()

const checkbox = ref<any>(null)

const onClick = () => {
  if( !props.required && !props.readonly ) {
    checkbox.value.click()
  }
}

onMounted(() => {
  if( !props.modelValue ) {
    emit('update:modelValue', props.array ? [] : false)
  }
})

const value = typeof props.value === 'object'
  ? (props.value?._id || props.value)
  : props.value

const selectedValues = (values: any[]): (string|boolean)[] => {
  return values.map((v: any) => v._id || v)
}

const bindVal = computed({
  get: () => {
    if( !props.modelValue ) {
      return false
    }

    if( props.isRadio ) {
      return props.modelValue === props.value
    }

    return Array.isArray(props.modelValue)
      ? selectedValues(props.modelValue).includes(props.value)
      : !!props.value
  },

  set: (newVal: boolean) => {
    if( props.readonly ) {
      return
    }

    if( props.isRadio ) {
      emit('update:modelValue', props.value)
      return
    }

    if( props.isBoolean ) {
      emit('update:modelValue', newVal)
      return
    }

    if( props.array || Array.isArray(props.modelValue) ) {
      emit('update:modelValue', !selectedValues(props.modelValue||[]).includes(value)
        ? [ ...props.modelValue||[], value ]
        : selectedValues(props.modelValue).filter((v: any) => v !== value))

    } else {
      emit('update:modelValue', !(props.modelValue === true))
    }
  }
})
</script>
