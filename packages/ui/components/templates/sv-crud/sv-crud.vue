<template>
  <div
    v-if="store"
    class="crud"
  >
    <div
      v-if="store.description.filtersPresets"
      class="crud__filter-presets"
    >
      <div
        v-clickable
        :class="`
          crud__filter-preset-button
          ${!route.hash && 'crud__filter-preset-button--active'}
        `"

        @click="togglePreset('', { filters: {} })"
      >
        {{ $t('all') }}
      </div>
      <div
        v-clickable
        v-for="([presetName, preset]) in Object.entries(store.description.filtersPresets)"
        :key="`filter-preset-${presetName}`"

        :class="`
          crud__filter-preset-button
          ${route.hash === `#${presetName}` && 'crud__filter-preset-button--active'}
        `"
        @click="togglePreset(presetName, preset)"
      >
        {{ preset.name }}
      </div>
    </div>
    <div
      v-if="!noControls"
      class="
        no-print
        crud__panel
      "
    >
      <div class="crud__panel-control">
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
        <sv-info v-if="
          !noLayoutToggle
            && store.description.layout
            && store.description.layout?.name !== 'tabular'
        ">
          <template #text>
            Alternar layout
          </template>
          <sv-icon
            v-clickable
            alt
            reactive
            name="table"
            @click="toggleLayout"
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
        <sv-filter-widget :key="store.$id"></sv-filter-widget>
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
          :icon="actionProps.icon"
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

    <!-- <sv-group -->
    <!--   :no-border="store.$currentLayout === 'grid'" -->
    <!--   :preserve-inner-borders="store.$currentLayout === 'grid'" -->
    <!-- > -->
    <div>
      <sv-box transparent fill>
        <div class="crud__table-panel">
          <sv-pagination :collection="collection"></sv-pagination>
          <!-- <sv-records-summary :collection="collection"></sv-records-summary> -->
        </div>
      </sv-box>

      <component
        :is="getLayout(store.$currentLayout)"
        v-bind="{
          individualActions,
          layoutOptions: layout?.options || store?.layout.options
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
      </component>
    </div>
    <!-- </sv-group> -->

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
import { useStore, useParentStore, useAction, CollectionStore } from '../../../../web'
import type { Layout, FiltersPreset } from '@semantic-api/types'

import {
  SvBox,
  SvGroup,
  SvButton,
  SvPagination,
  SvInfo,
  SvIcon

} from '../../'

import { getLayout } from './_internals/layouts'
import SvReportWidget from './_internals/components/sv-report-widget/sv-report-widget.vue'
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
  noLayoutToggle?: boolean
  parentCollection?: string
  parentField?: string
  layout?: Layout
}

type Emits = {
  (e: 'uiEvent', event: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const router = useRouter()

let
  store: CollectionStore,
  parentStore: CollectionStore

const metaStore = useStore('meta')

store = useStore(props.collection)
parentStore = props.parentField
  ? useParentStore(props.parentCollection)
  : null

const route = useRoute()
const [call, actionEventBus] = useAction(store, router)

const fetchItems = async () => {
  /*
  if( props.parentField ) {
    if( !parentStore.item._id ) {
      await parentStore.get({
        filters: {
          owner: userStore.$currentUser._id
        }
      })
    }

    store.setItems(parentStore.item[props.parentField]||[])
    return
  }
  */
  return store.filter({
    project: [
      ...Object.keys(store.properties),
      ...store.tableMeta
    ]
  })
}

onMounted(() => {
  metaStore.view.title = props.collection
  metaStore.view.collection = props.collection
  isInsertReadonly.value = false

  if( route.hash && store.description.filtersPresets ) {
    const presetName = route.hash.slice(1)
    togglePreset(presetName, store.description.filtersPresets[presetName])
    return
  }

  if( !props.noFetch /*&& (props.parentField || store.itemsCount === 0)*/ ) {
    fetchItems()
  }
})

onUnmounted(() => {
  const getFilters = () => store.filters
  const oldFilters = getFilters()
  store.clearFilters()
  store.filtersPreset = {}
  store.preferredTableProperties = []

  if( Object.keys(oldFilters).length > 0 ) {
    const filters = getFilters()
    const changed = Object.entries(oldFilters)
      .some(([key, value]: [string, any]) => filters[key] !== value)

    if( changed ) {
      store.clearItems()
    }
  }
})

watch(() => actionEventBus, async (event) => {
  if (
    [
      'spawnEdit',
      'spawnView',
      'duplicate',
    ].includes(event.name)
  ) {
    await store.get({
      filters: {
        _id: event.params._id
      }
    })
  }

  if( event.name === 'spawnAdd' ) {
    store.clearItem()
    isInsertVisible.value = true
  }

  else if( event.name === 'spawnEdit' ) {
    isInsertVisible.value = true
  }

  else if( event.name === 'spawnView' ) {
    isInsertReadonly.value = true
    isInsertVisible.value = true
  }

  else if( event.name === 'duplicate' ) {
    const newItem = Object.entries(store.item).reduce((a, [key, value]: [string, any]) => {
      const property = store.properties[key]||{}
      const unbound = (value: any) => {
        if( property.s$isFile ) {
          value = {}
        }
        if( property.s$inline ) {
          delete value._id
        }
      }

      property.type === 'array'
        ? value.forEach(unbound)
        : unbound(value)

      return {
        ...a,
        [key]: value
      }
    }, {})

    store.setItem({
      ...newItem,
      _id: undefined
    })

    store.referenceItem = {}
    isInsertVisible.value = true
  }

  else {
    emit('uiEvent', event)
  }

}, { deep: true })


watch(() => isInsertVisible, (value) => {
  if( value.value === false ) {
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

const toggleLayout = () => {
  store.currentLayout = store.currentLayout === 'tabular'
    ? store.description.layout!.name
    : 'tabular'
}

const togglePreset = (presetName: string, preset: FiltersPreset) => {
  store.filtersPreset = preset.filters
  store.preferredTableProperties = preset.table || []

  store.pagination.offset = 0
  store.filter()
  router.push({ hash: presetName ? `#${presetName}` : '' })
}

provide('storeId', computed(() => props.collection))
provide('individualActions', individualActions)
provide('parentStore', parentStore)
</script>

<style scoped src="./sv-crud.scss"></style>
