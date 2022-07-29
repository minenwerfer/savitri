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
          @clicked="metaStore.report.isVisible = true"
        >
          Exportar
        </sv-button>
      </div>
      <div class="crud__panel-control" v-if="store.actions || $slots.actions" :key="collection">
        <sv-button
          v-for="([action, actionProps], index) in Object.entries(store.actions||{})"
          :key="`action-${index}`"
          v-bind="{
            type: 'neutral',
            icon: actionProps.unicon,
            disabled: store.isLoading || store.selectedIds.length === 0 && actionProps.selection
          }"
          @clicked="callAction()(action, props, { _id: selectedIds })"
        >
          {{ actionProps.name }}
        </sv-button>
        <slot name="actions"></slot>
      </div>
    </div>

    <teleport to="body">
      <sv-box
        v-model:visible="metaStore.crud.isInsertVisible"
        :title="`${isInsertReadonly ? 'Examinar' : 'Modificar'} ${$t(collection)}`"
        :float="true"
        @close="store.dispatch('meta/closeCrud')"
      >
        <template #body>
          <sv-form
            :key="`${store.item?._id}-form`"
            :form="store.fields"
            :form-data="store.item"

            :is-readonly="isInsertReadonly"
            :flex="store.description.flex"
            @add="$e.preventDefault()"
          ></sv-form>
        </template>
        <template #footer v-if="!isInsertReadonly">
          <sv-button
            :disabled="store.isLoading"
            @clicked="store.dispatch(`${collection}/deepInsert`, { what: item, __crudClose: true })"
          >
            Salvar
          </sv-button>
        </template>
      </sv-box>
    </teleport>

    <sv-report v-model:visible="metaStore.report.isVisible"></sv-report>

    <sv-box>
      <div class="crud__table-panel">
        <sv-pagination></sv-pagination>
        <sv-records-summary></sv-records-summary>
      </div>
    </sv-box>

    <sv-box :fill="true" :transparent="true" classes="overflow-y-visible">
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
      <div
        v-if="store.itemsCount === 0 && !store.isLoading"
        class="grid place-items-center py-4"
      >
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
  provide,
  watch,
  computed,
  reactive,

} from 'vue'

import { useRouter, useRoute } from 'vue-router'
import { useStore } from '@savitri/web'
import { action } from '../../../../common'
import {
  SvBox,
  SvTable,
  SvForm,
  SvButton,
  SvPagination,
  SvBareButton,
  SvIcon

} from '../../'

import SvReport from './_internals/components/sv-report/sv-report.vue'
import SvRecordsSummary from './_internals/components/sv-records-summary/sv-records-summary.vue'
import SvFilterWidget from './_internals/components/sv-filter-widget/sv-filter-widget.vue'

interface Props {
  collection: string
}

const props = defineProps<Props>()

const store = useStore(props.collection)
const metaStore = useStore('meta')

const router = useRouter()
const { hash } = useRoute()
const collectionRefs = reactive({})

provide('storeId', computed(() => props.collection))

const hasSelectionActions = computed(() => {
  return Object.values(collectionRefs.actions||{})
    .some((action: any) => !!action.selection)
})

onMounted(() => {
  if( store.itemsCount === 0 ) {
    store.getAll()
  }

})

onUnmounted(() => {
  metaStore.view.title = props.collection

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

// watch(() => [props.collection, hash], async ([collectionName]: [string]) => {
  // if( store.itemsCount === 0 ) {
    // const filters = collectionRefs.description._filters

    // new!
    // store.getAll()

//    store.dispatch(`${collectionName}/getAll`, {
//      filters: {
//        ...filters,
//        ...collectionRefs.filters,
//        ...(!Object.values(filters||{}).find((_) => !!_) ? store.state[collectionName].defaultFilters : {}),
//      },
//    })
  // }

// }, { immediate: true })


watch(() => metaStore.crud.isInsertVisible, (value: boolean) => {
  if( value === false ) {
    store.clear()
  }
})

const callAction = () => action(props.collection, store, router)

const individualActions = computed(() => {
  return store.individualActions
    .map((action: any) => ({
      // click: (payload: any) => //callAction()(action.action, action, filters),
      // store[action.action](payload),
      click: (() => {
        if( !(action.action in store) ) {
          throw new Error(
            `action ${action.action} doesnt exist on store ${store.$id}`
          )
        }
        return store[action.action]
      })(),
      ...action
    }))
})
</script>

<style scoped src="./sv-crud.scss"></style>
