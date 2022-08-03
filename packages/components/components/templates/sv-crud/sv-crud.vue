<template>
  <div class="crud">
    <div class="crud__panel">
      <div class="crud__panel-control">
        <sv-filter-widget :key="store.$id"></sv-filter-widget>
        <sv-button
          v-if="store.description.report"
          v-bind="{
            icon: 'export',
            type: 'neutral',
            variant: 'light'
          }"
          @clicked="isReportVisible = true"
        >
          Exportar
        </sv-button>
      </div>
      <div class="crud__panel-control" v-if="store.actions || $slots.actions" :key="collection">
        <sv-button
          v-for="(actionProps, index) in store.actions"
          :key="`action-${index}`"
          v-bind="{
            type: 'neutral',
            icon: actionProps.unicon,
            disabled: store.isLoading || store.selectedIds.length === 0 && actionProps.selection
          }"
          @clicked="call(actionProps)({ _id: selectedIds })"
        >
          {{ actionProps.name }}
        </sv-button>
        <slot name="actions"></slot>
      </div>
    </div>

    <!-- v-if is used on purpose to force re-rendering -->
    <sv-insert-widget v-if="isInsertVisible"></sv-insert-widget>
    <sv-report-widget></sv-report-widget>

    <sv-box>
      <div class="crud__table-panel">
        <sv-pagination></sv-pagination>
        <sv-records-summary></sv-records-summary>
      </div>
    </sv-box>

    <sv-box :fill="true" :transparent="true">
      <sv-table
        v-if="store.tableDescription"
        :key="store.$id"

        v-bind="{
          checkbox: hasSelectionActions,
          columns: {
            ...store.tableDescription,
            ...(individualActions.length > 0
              ? {
                __custom: {
                  label: 'Ações',
                  actions: individualActions
                }
              } : {}
            )
          },
          rows: store.$items,
        }"
      ></sv-table>
      <div v-if="store.itemsCount === 0 && !store.isLoading">
        <div class="opacity-80">
          Não foram retornados resultados.
        </div>
      </div>
    </sv-box>

  </div>
</template>

<script setup lang="ts">
import {
  onMounted,
  onUnmounted,
  computed,
  provide,
  watch,

} from 'vue'

import { useRouter, useRoute } from 'vue-router'
import { useStore, useAction, ActionEvent } from '@savitri/web'
import {
  SvBox,
  SvTable,
  SvForm,
  SvButton,
  SvPagination,
  SvBareButton,
  SvIcon

} from '../../'

import SvReportWidget from './_internals/components/sv-report-widget/sv-report-widget.vue'
import SvRecordsSummary from './_internals/components/sv-records-summary/sv-records-summary.vue'
import SvFilterWidget from './_internals/components/sv-filter-widget/sv-filter-widget.vue'
import SvInsertWidget from './_internals/components/sv-insert-widget/sv-insert-widget.vue'

import {
  isInsertVisible,
  isInsertReadonly,
  isReportVisible,

} from './_internals/store'

type Props = {
  collection: string
}

const props = defineProps<Props>()

const store = useStore(props.collection)
const metaStore = useStore('meta')

const router = useRouter()
const { hash } = useRoute()
const [call, actionEventBus] = useAction(store, router)

provide('storeId', computed(() => props.collection))

const hasSelectionActions = computed(() => {
  return store.actions
    .some((action: any) => !!action.selection)
})

onMounted(() => {
  metaStore.view.title = props.collection
  metaStore.view.collection = props.collection
  isInsertReadonly.value = false

  if( store.itemsCount === 0 ) {
    store.getAll()
  }

})

onUnmounted(() => {
  if( !hash.slice(1).split(',').includes('refresh') ) {
    return
  }

  const getFilters = () => store.filters
  const oldFilters = getFilters()
  store.clearFilters()

  if( Object.keys(oldFilters).length > 0 ) {
    const filters = getFilters()
    const changed = Object.entries(oldFilters)
      .some(([key, value]: [string, any]) => filters[key] !== value)

    if( changed ) {
      store.clearItems()
    }
  }
})


watch(() => actionEventBus, (event: ActionEvent) => {
  if( event.name === 'spawnAdd' ) {
    store.clearItem()
    isInsertVisible.value = true
  }

  if( event.name === 'spawnEdit' ) {
    store.setItem(event.params.filters)
    isInsertVisible.value = true
  }

  if( event.name === 'duplicate' ) {
    const { filters: newItem } = event.params
    delete newItem._id

    store.setItem(newItem)
    isInsertVisible.value = true
  }

}, { deep: true })


watch(() => isInsertVisible, (value: boolean) => {
  if( value === false ) {
    metaStore.view.collection = props.collection
    store.clearItem()
  }
})

const individualActions = computed(() => {
  return store.individualActions
    .map((action: any) => ({
      click: call(action),
      ...action
    }))
})
</script>

<style scoped src="./sv-crud.scss"></style>
