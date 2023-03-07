<template>
  <div
    v-if="store"
    class="crud"
  >
    <div
      v-if="!noControls && false"
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
        <sv-filter-widget :key="store.$id"></sv-filter-widget>
      </div>
    </div>

    <sv-insert-widget
      v-if="isInsertVisible"
      v-bind="{
        parentCollection,
        parentField
      }"
    ></sv-insert-widget>

    <div>
      <sv-box
        transparent
        fill
        class="crud__table-panel"
      >
        <sv-pagination :collection="collection"></sv-pagination>
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

import { useRouter } from 'vue-router'
import { useStore, useParentStore, useAction, CollectionStore } from '../../../../web'
import type { Layout } from '@semantic-api/types'

import {
  SvBox,
  SvPagination,
  SvInfo,
  SvIcon

} from '../../'

import { getLayout } from './_internals/layouts'
import SvFilterWidget from './_internals/components/sv-filter-widget/sv-filter-widget.vue'
import SvInsertWidget from './_internals/components/sv-insert-widget/sv-insert-widget.vue'

import {
  isInsertVisible,
  isInsertReadonly,
  call,
  actionEventBus

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

const action = useAction(store, router)
call.value = action[0]
actionEventBus.value = action[1]

const fetchItems = async () => {
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

watch(() => actionEventBus.value, async (event) => {
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
    click: call.value(action),
    ...action
  }))
})

const toggleLayout = () => {
  store.currentLayout = store.currentLayout === 'tabular'
    ? store.description.layout!.name
    : 'tabular'
}

provide('storeId', computed(() => props.collection))
provide('individualActions', individualActions)
provide('parentStore', parentStore)
</script>

<style scoped src="./sv-crud.scss"></style>
