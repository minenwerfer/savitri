<template>
  <sv-box fill transparent-mobile>
    <sv-table
      v-if="store.properties"
      v-loading="store.isLoading"
      :key="store.$id"

      v-bind="{
        checkbox: store.hasSelectionActions,
        columns: store.tableProperties,
        rows: store.$items,
        actions: individualActions,
        layout: store.tableLayout
      }"
    ></sv-table>
  </sv-box>
</template>

<script setup lang="ts">
import { useParentStore } from '@savitri/web'
import { LayoutOptions } from '../../../../../../../types'
import { SvBox, SvTable } from '../../../../..'

type Props = {
  individualActions: any
  hasSelectionActions: boolean
  layoutOptions: LayoutOptions
}

const props = defineProps<Props>()
const store = useParentStore()
</script>
