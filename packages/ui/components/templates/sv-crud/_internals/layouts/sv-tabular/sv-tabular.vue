<template>
  <sv-box v-detachable="store.items" fill transparent-mobile>
    <sv-table
      v-if="store.properties"
      v-loading="store.isLoading"
      :key="store.$id"

      v-bind="{
        collection: storeId,
        checkbox: store.hasSelectionActions,
        columns: store.tableProperties,
        rows: store.items,
        actions: individualActions,
        layout: store.tableLayout
      }"
    ></sv-table>
  </sv-box>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { LayoutOptions } from '@semantic-api/types'
import { useParentStore } from '../../../../../../../web'
import { SvBox, SvTable } from '../../../../..'

type Props = {
  individualActions: any
  hasSelectionActions: boolean
  layoutOptions: LayoutOptions
}

const props = defineProps<Props>()
const store = useParentStore()

const storeId = inject('storeId', '')
</script>
