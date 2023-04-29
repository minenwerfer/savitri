<script setup lang="ts">
import {
  onMounted,
  onUnmounted,
  computed,
  provide,
  watch

} from 'vue'

import {
  useStore,
  useParentStore,
  useRouter,
  useAction,
  CollectionStore

} from '@savitri/web'

import type { Layout } from '@semantic-api/types'

import SvPagination from '../sv-pagination/sv-pagination.vue'
import SvInfo from '../sv-info/sv-info.vue'
import SvBareButton from '../sv-bare-button/sv-bare-button.vue'
import SvIcon from '../sv-icon/sv-icon.vue'

import { getLayout } from './_internals/layouts'
import SvFilterPanel from './_internals/components/sv-filter-panel/sv-filter-panel.vue'
import SvInsertPanel from './_internals/components/sv-insert-panel/sv-insert-panel.vue'

import {
  isInsertVisible,
  isInsertReadonly,
  isFilterVisible,
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
const router = await useRouter()

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

const toggleLayout = (store: any) => {
  store.currentLayout = store.currentLayout === 'tabular'
    ? store.description.layout!.name
    : 'tabular'
}

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
    isInsertVisible.value = 'add'
  }

  else if( event.name === 'spawnEdit' ) {
    isInsertVisible.value = 'edit'
  }

  else if( event.name === 'spawnView' ) {
    isInsertReadonly.value = true
    isInsertVisible.value = 'view'
  }

  else if( event.name === 'duplicate' ) {
    const newItem = Object.entries(store.item).reduce((a, [key, value]: [string, any]) => {
      const property = store.properties[key]||{}
      const unbound = (value: any) => {
        if( property.s$isFile ) {
          return {}
        }
        if( property.s$inline ) {
          const { _id, ...rest } = value
          return rest
        }
        return value
      }

      value = property.type === 'array'
        ? value.map(unbound)
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
    isInsertVisible.value = 'duplicate'
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

provide('storeId', computed(() => props.collection))
provide('individualActions', individualActions)
provide('parentStore', parentStore)
</script>

<template>
  <div
    v-if="store"
    class="crud"
  >
    <sv-filter-panel
      v-if="isFilterVisible"
      v-model:visible="isFilterVisible"
      :key="store.$id"
    ></sv-filter-panel>

    <sv-insert-panel
      v-if="isInsertVisible"
      v-bind="{
        parentCollection,
        parentField
      }"
    ></sv-insert-panel>

    <div>
      <div
        v-if="!noControls"
        class="crud__controls"
      >
        <div style="
          display: flex;
          align-items: center;
        ">
          <sv-info
            v-if="store && Object.keys(store.availableFilters).length > 0"
            where="bottom"
          >
            <template #text>
              Filtros
            </template>
            <sv-icon
              v-if="store && Object.keys(store.availableFilters).length > 0"
              v-clickable
              small
              reactive
              name="filter"
              @click="isFilterVisible = true"
            ></sv-icon>
          </sv-info>
          <sv-info
            v-if="store && Object.keys(store.availableFilters).length > 0"
            where="bottom"
          >
            <template #text>
              Limpar filtros
            </template>
            <sv-bare-button :disabled="store.filtersCount === 0">
              <sv-icon
                v-if="store && Object.keys(store.availableFilters).length > 0"
                small
                reactive
                name="trash"
                @click="store.clearFilters"
              ></sv-icon>
            </sv-bare-button>
          </sv-info>
          <sv-info v-if="!noRefresh" where="bottom">
            <template #text>
              Atualizar
            </template>
            <sv-icon
              v-clickable
              small
              reactive
              name="refresh"
              @click="fetchItems"
            ></sv-icon>
          </sv-info>
          <sv-info
            v-if="
              !noLayoutToggle && store
                && store.description.layout
                && store.description.layout?.name !== 'tabular'
            "
            where="bottom"
          >
            <template #text>
              Alternar layout
            </template>
            <sv-icon
              v-clickable
              small
              reactive
              name="table"
              @click="toggleLayout(store)"
            ></sv-icon>
          </sv-info>
        </div>
        <sv-pagination :collection="collection"></sv-pagination>
      </div>

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

<style scoped src="./sv-crud.scss"></style>
