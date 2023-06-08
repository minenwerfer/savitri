<script setup lang="ts">
import {
  onUnmounted,
  ref,
  computed,
  provide,
  inject,
  watch

} from 'vue'

import {
  useStore,
  useParentStore,
  useRouter,
  useAction,
  useDebounce,
  CollectionStore

} from '@savitri/web'

import type { Layout } from '@semantic-api/types'
import { deepClone } from '@semantic-api/common'

import SvPagination from '../sv-pagination/sv-pagination.vue'
import SvBareButton from '../sv-bare-button/sv-bare-button.vue'
import SvInfo from '../sv-info/sv-info.vue'
import SvIcon from '../sv-icon/sv-icon.vue'
import SvInput from '../form/sv-input/sv-input.vue'

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
  action?: any
  componentProps?: Record<string, any>
}

type Emits = {
  (e: 'uiEvent', event: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const router = await useRouter()

const debounce = useDebounce({
  delay: 600
})

const queryString = ref('')

let
  store: CollectionStore,
  parentStore: CollectionStore

const metaStore = useStore('meta')

store = useStore(props.collection)
parentStore = props.parentField
  ? useParentStore(props.parentCollection)
  : null

const action = props.action
  ? props.action.value || props.action
  : useAction(store, router)

call.value = action[0]
actionEventBus.value = action[1]

const fetchItems = async () => {
  return store.filter({
    project: [
      ...(store.description.table || Object.keys(store.properties)),
      ...store.tableMeta
    ]
  })
}

watch(router.currentRoute, () => {
  metaStore.view.title = props.collection
  metaStore.view.collection = props.collection
  isInsertReadonly.value = false

  if( !props.noFetch /*&& (props.parentField || store.itemsCount === 0)*/ ) {
    fetchItems()
  }
}, {
  immediate: true,
  flush: 'post'
})

const [performLazySearch] = debounce((value: string) => {
  if( !value ) {
    store.filters = deepClone(store.freshFilters)
    return fetchItems()
  }

  store.filters = Object.assign(deepClone(store.freshFilters), {
    $text: {
      $search: `"${value}"`,
      $caseSensitive: false
    }
  })

  return fetchItems()
})

watch(queryString, (value) => {
  performLazySearch(value)
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
    if( event.params?.item ) {
      store.setItem(event.params.item)
      Object.keys(event.params.item).forEach((key) => {
        delete store.referenceItem[key]
      })
    }
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
        if( property.s$inline && value ) {
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


  <div class="crud__main">
    <div
      v-if="store.itemsCount > 0"
      class="crud__controls"
    >
      <div v-if="store.description.search?.active" style="width: 100%">
        <sv-input
          v-model="queryString"
          v-bind="{
            variant: 'bold',
            property: {
              type: 'text',
              s$icon: 'search-alt',
              s$placeholder: store.description.search.placeholder || 'Pesquise aqui',
              s$inputType: 'search'
            }
          }"
        ></sv-input>
      </div>

      <sv-info v-if="!noRefresh" where="bottom">
        <template #text>
          Atualizar
        </template>
        <sv-icon
          v-clickable
          reactive
          name="refresh"
          @click="fetchItems"
        ></sv-icon>
      </sv-info>

      <sv-icon
        v-if="store && Object.keys(store.availableFilters).length > 0"
        v-clickable
        reactive
        name="filter"
        @click="isFilterVisible = true"
      >
        Filtros
      </sv-icon>

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
            reactive
            name="trash"
            @click="() => (store.clearFilters() && store.filter(undefined, { unproxied: true }))"
          ></sv-icon>
        </sv-bare-button>
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
          reactive
          name="table"
          @click="toggleLayout(store)"
        ></sv-icon>
      </sv-info>
    </div>

    <div v-loading="store.loading.getAll">
      <div v-if="store.itemsCount === 0 && $slots.empty">
        <slot name="empty"></slot>
      </div>

      <slot
        v-else-if="$slots.component"
        v-bind="{
          store
        }"
        name="component"
      ></slot>

      <component
        v-else
        v-bind="{
          individualActions,
          layoutOptions: layout?.options || store?.layout.options,
          componentProps
        }"
        :is="getLayout(layout?.name || store.$currentLayout)"
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

        <template #tfoot v-if="$slots.tfoot">
          <slot name="tfoot"></slot>
        </template>
      </component>

    </div>
  </div>

  <div
    v-if="!noControls && !store.loading.getAll && store.itemsCount > 0"
    class="crud__controls"
  >
    <sv-pagination :collection="collection"></sv-pagination>
  </div>
</template>

<style scoped src="./sv-crud.scss"></style>
