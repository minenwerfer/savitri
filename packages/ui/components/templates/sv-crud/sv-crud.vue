<template>
  <div v-if="store" class="crud">
    <div
      v-if="!noControls"
      class="crud__panel"
    >
      <div class="crud__panel-control">
        <sv-filter-widget :key="store.$id"></sv-filter-widget>
        <sv-info v-if="!noRefresh">
          <template #text>
            Atualizar
          </template>
          <sv-icon
            v-clickable
            alt
            reactive
            name="refresh"
            @click="fetchItems"
          ></sv-icon>
        </sv-info>
        <sv-button
          small
          v-if="store.description.report"
          icon="export"
          variant="alt"
          @clicked="isReportVisible = true"
        >
          Exportar
        </sv-button>
      </div>
      <div
        v-if="store.actions || $slots.actions"
        :key="collection"
        class="
          crud__panel-control
          crud__panel-control--custom
        "
      >
        <sv-button
          v-for="(actionProps, index) in store.actions"
          :key="`action-${index}`"
          :icon="actionProps.unicon"
          :disabled="store.selectedIds.length === 0 && actionProps.selection"
          @clicked="call(actionProps)({ _id: selectedIds })"
        >
          {{ actionProps.name }}
        </sv-button>
        <slot v-if="$slots.actions" name="actions"></slot>
      </div>
    </div>

    <sv-insert-widget
      v-if="isInsertVisible"
      v-bind="{
        parentCollection,
        parentField
      }"
    ></sv-insert-widget>
    <sv-report-widget :collection="collection"></sv-report-widget>

    <sv-box>
      <div class="crud__table-panel">
        <sv-pagination></sv-pagination>
        <sv-records-summary></sv-records-summary>
      </div>
    </sv-box>

    <sv-box fill transparent-mobile>
      <sv-table
        v-if="store.tableDescription"
        v-loading="store.isLoading"
        :key="store.$id"

        v-bind="{
          checkbox: hasSelectionActions,
          columns: store.tableDescription,
          rows: store.$items,
          actions: individualActions,
          layout: store.tableLayout
        }"
      ></sv-table>
    </sv-box>

  </div>
</template>

<script setup lang="ts">
import {
  onMounted,
  onUnmounted,
  computed,
  provide,
  watch

} from 'vue'

import { useRouter, useRoute } from 'vue-router'
import { useStore, useParentStore, ActionEvent } from '@savitri/web'
import useAction from '../../../composables/use-action'

import {
  SvBox,
  SvTable,
  SvForm,
  SvButton,
  SvPagination,
  SvBareButton,
  SvInfo,
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
  noControls?: boolean
  noFetch?: boolean
  noRefresh?: boolean
  parentCollection?: string
  parentField?: string
}

const props = defineProps<Props>()
const router = useRouter()

let store, parentStore
const metaStore = useStore('meta')

try {
  store = useStore(props.collection)
} catch( e ) {
  router.push({ name: 'not-found' })
}

if( props.parentField ) {
  parentStore = useParentStore(props.parentCollection)
}

const { hash } = useRoute()
const [call, actionEventBus] = useAction(store, router)

const hasSelectionActions = computed(() => {
  return store.actions
    .some((action: any) => !!action.selection)
})

const fetchItems = async () => {
  if( props.parentField ) {
    store.setItems(parentStore.item[props.parentField]||[])
    return
  }

  return store.filter({
    project: [
      ...Object.keys(store.tableDescription),
      ...store.tableMeta
    ]
  })
}

onMounted(() => {
  metaStore.view.title = props.collection
  metaStore.view.collection = props.collection
  isInsertReadonly.value = false

  if(
    !props.noFetch /*&& (props.parentField || store.itemsCount === 0)*/ ) {
    fetchItems()
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


watch(() => actionEventBus, async (event: ActionEvent) => {
  if (
    [
      'spawnEdit',
      'spawnView',
      'duplicate',
    ].includes(event.name)
  ) {
    await store.get({
      filters: {
        _id: event.params.filters._id
      }
    })
  }

  if( event.name === 'spawnAdd' ) {
    store.clearItem()
    isInsertVisible.value = true
  }

  if( event.name === 'spawnEdit' ) {
    isInsertVisible.value = true
  }

  if( event.name === 'spawnView' ) {
    isInsertReadonly.value = true
    isInsertVisible.value = true
  }

  if( event.name === 'duplicate' ) {
    const newItem = Object.entries(store.item).reduce((a: any, [key, value]: [string, any]) => {
      if( store.fields[key]?.collection === 'file' ) {
        return a
      }

      return {
        ...a,
        [key]: value
      }
    }, {})

    store.setItem({
      ...newItem,
      _id: undefined
    })
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
  return store.individualActions.map((action: any) => ({
    click: call(action),
    ...action
  }))
})

provide('storeId', computed(() => props.collection))
provide('individualActions', individualActions)
provide('parentStore', parentStore)
</script>

<style scoped src="./sv-crud.scss"></style>
