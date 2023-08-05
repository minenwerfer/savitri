<script setup lang="ts">
import SvCrud from '../../../components/sv-crud/sv-crud.vue'

type Props = {
  collection: string
}

const props = defineProps<Props>()
</script>

<template>
  <sv-crud
    v-if="collection"
    :collection="collection"
    :key="collection"
  >
    <template #empty v-if="$slots['crud-empty']">
      <slot name="crud-empty"></slot>
    </template>
  </sv-crud>
</template>
