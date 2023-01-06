<template>
  <ion-select
    :placeholder="property.description || propertyName"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <ion-select-option
      v-for="option in property.enum"
      :key="option"
      :value="option"
    >
      {{ option }}
    </ion-select-option>
  </ion-select>
</template>

<script setup lang="ts">
import { CollectionProperty } from '@savitri/types'
import { IonSelect, IonSelectOption } from '@ionic/vue'

type Props = {
  modelValue: any
  property: CollectionProperty
  propertyName: string
}

const props = defineProps<Props>()
const property = props.property
</script>
