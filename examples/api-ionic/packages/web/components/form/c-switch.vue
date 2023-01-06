<template>
  <ion-item>
    <ion-label>{{ property.description || propertyName }}</ion-label>
    <ion-toggle @update:model-value="$emit('update:modelValue', $event)"></ion-toggle>
  </ion-item>
</template>

<script setup lang="ts">
import { CollectionProperty } from '@savitri/types'
import { IonItem, IonLabel, IonToggle } from '@ionic/vue'

type Props = {
  modelValue: any
  property: CollectionProperty
  propertyName: string
}

const props = defineProps<Props>()
const property = props.property
</script>
