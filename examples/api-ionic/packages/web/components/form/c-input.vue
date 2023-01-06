<template>
  <ion-item>
    <ion-label>
      {{ property.description || propertyName }}
    </ion-label>
    <ion-input
      :type="propType"
      @update:model-value="update"
    ></ion-input>
  </ion-item>
</template>

<script setup lang="ts">
import { CollectionProperty } from '@savitri/types'
import { IonItem, IonLabel, IonInput } from '@ionic/vue'

type Props = {
  property: CollectionProperty
  propertyName: string
}

type Emits = {
  (e: 'update:modelValue', value: string|number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const property = props.property

const propType = ((): 'text' | 'number' => {
  if( property.type === 'number' ) {
    return 'number'
  }

  return 'text'
})()

const update = (value: any) => {
  const newVal = property.type === 'number'
    ? Number(value)
    : value

  emit('update:modelValue', newVal)
}
</script>
