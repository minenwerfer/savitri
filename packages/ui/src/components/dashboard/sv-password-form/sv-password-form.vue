<script setup lang="ts">
import { usePasswordPolicy } from '@savitri/web'
import { computed, provide } from 'vue'
import SvForm from '../../form/sv-form/sv-form.vue'

type Props = {
  modelValue: Record<string, any> & {
    password: string
    confirmation: string
  }
}

const props = defineProps<Props>()
provide('storeId', null)

const passwordPolicy = usePasswordPolicy()

const passwordError = computed(() => {
  return passwordPolicy(
    props.modelValue.password,
    props.modelValue.confirmation,
  )
})
</script>

<template>
  <sv-form
    :form="{
      password: {
        type: 'string',
        s$icon: 'key-skeleton',
        s$inputType: 'password'
      },
      confirmation: {
        type: 'string',
        s$icon: 'key-skeleton',
        s$inputType: 'password'
      },
    }"

    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  ></sv-form>

  <div>
    {{ passwordError || 'Senhas conferem' }}
  </div>

  <slot v-bind="{ passwordError }"></slot>
</template>
