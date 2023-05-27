<script setup lang="ts">
import { inject } from 'vue'
import { LayoutOptions } from '@semantic-api/types'
import { useParentStore } from '@savitri/web'
import SvTable from '../../../../sv-table/sv-table.vue'

type Props = {
  individualActions: any
  hasSelectionActions: boolean
  layoutOptions: LayoutOptions
}

const props = defineProps<Props>()
const store = useParentStore()

const storeId = inject('storeId', '')
</script>

<template>
  <slot v-if="$slots.inner" name="inner"></slot>
  <sv-table
    v-if="store.properties"
    :key="store.$id"

    v-bind="{
      collection: storeId,
      checkbox: store.hasSelectionActions,
      columns: store.tableProperties,
      rows: store.items,
      actions: individualActions,
      layout: store.tableLayout
    }"
  >
    <template
      v-for="slotName in Object.keys($slots).filter(key => key.startsWith('row-'))"
      v-slot:[slotName]="slotProps"
    >
      <slot
        v-bind="slotProps"
        :name="slotName"
      ></slot>
    </template>
  </sv-table>
</template>
