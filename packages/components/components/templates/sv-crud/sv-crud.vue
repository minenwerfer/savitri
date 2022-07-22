<template>
  <div class="crud">
    <div class="crud__panel">
      <div class="crud__panel-control">
        <sv-filter-widget :key="store1.$id"></sv-filter-widget>
        <sv-button
          v-if="store1.description.report"
          v-bind="{
            icon: 'export',
            type: 'neutral',
            variant: 'light'
          }"
          @clicked="store.dispatch('meta/spawnReport')"
        >
          Exportar
        </sv-button>
      </div>
      <div class="crud__panel-control" v-if="store1.actions || $slots.actions" :key="module">
        <sv-button
          v-for="([action, actionProps], index) in Object.entries(store1.actions||{})"
          :key="`action-${index}`"
          v-bind="{
            type: 'neutral',
            icon: actionProps.unicon,
            disabled: isLoading || store1.selectedIds.length === 0 && actionProps.selection
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
        :title="`${isInsertReadonly ? 'Examinar' : 'Modificar'} ${$t(module)}`"
        :float="true"
        @close="store.dispatch('meta/closeCrud')"
      >
        <template #body>
          <sv-form
            :key="`${store1.item?._id}-form`"
            :form="store1.fields"
            :form-data="store1.item"

            :is-readonly="isInsertReadonly"
            :flex="store1.description.flex"
            @add="$e.preventDefault()"
          ></sv-form>
        </template>
        <template #footer v-if="!isInsertReadonly">
          <sv-button
            :disabled="isLoading"
            @clicked="store.dispatch(`${module}/deepInsert`, { what: item, __crudClose: true })"
          >
            Salvar
          </sv-button>
        </template>
      </sv-box>
    </teleport>

    <sv-report :module="module" v-model:visible="isReportVisible"></sv-report>

    <sv-box>
      <div class="crud__table-panel">
        <sv-pagination :module="module"></sv-pagination>
        <sv-records-summary
          v-bind="{
            recordsCount,
            recordsTotal,
            currentPage,
            limit
          }"
        ></sv-records-summary>
      </div>
    </sv-box>

    <sv-box :fill="true" :transparent="true" classes="overflow-y-visible">
      <sv-table
        :key="store1.$id"
        v-if="store1.tableDescription"
        :checkbox="hasSelectionActions"
        :columns="{
          ...store1.tableDescription,
          ...(store1.individualActions.length > 0
            ? {
              __custom: {
                label: 'Ações',
                actions: store1.individualActions
              }
            } : {}
          )
        }"

        :rows="store1.$items"
        :recordsCount="recordsCount"
        :recordsTotal="recordsTotal"
      ></sv-table>
      <div
        v-if="store1.itemsCount === 0 && !isLoading"
        class="grid place-items-center py-4"
      >
        <div class="opacity-80">
          {{ store1.$items }}
          Não foram retornados resultados.
        </div>
      </div>
    </sv-box>

  </div>
</template>

<script setup lang="ts">
import {
  onUnmounted,
  provide,
  watch,
  computed,
  reactive,
  toRefs

} from 'vue'

import { useRouter, useRoute } from 'vue-router'
import { useModule } from '../../../../web'
import { action } from '../../../../common'
import {
  SvBox,
  SvTable,
  SvForm,
  SvButton,
  SvPagination,
  SvBareButton,
  SvReport,
  SvIcon

} from '../../'

import SvRecordsSummary from './_internals/components/sv-records-summary/sv-records-summary.vue'
import SvFilterWidget from './_internals/components/sv-filter-widget/sv-filter-widget.vue'

import { useStore as useStore1 } from '../../../../web'

interface Props {
  module: string
}

const props = defineProps<Props>()

const store1 = useStore1(props.module)
const metaStore = useStore1('meta')

const router = useRouter()
const { hash } = useRoute()
const moduleRefs = reactive({})

provide('storeId', computed(() => props.module))

const isReportVisible = computed({
  get: () => metaStore.report.isVisible,
  set: (value: boolean) => store.dispatch(`meta/${value ? 'spawn' : 'close'}Report`)
})

const hasSelectionActions = computed(() => {
  return Object.values(moduleRefs.actions||{})
    .some((action: any) => !!action.selection)
})

onUnmounted(() => {
  metaStore.view.title = props.module

  if( !hash.slice(1).split(',').includes('refresh') ) {
    return
  }

  const getFilters = () => store1.filters
  const oldFilters = getFilters()
  store1.clearFilters()

  if( Object.keys(oldFilters).length > 0 ) {
    const filters = getFilters()
    const changed = Object.entries(oldFilters)
      .some(([key, value]: [string, any]) => filters[key] !== value)

    if( changed ) {
      store1.clearAll()
    }
  }
})

watch(() => [props.module, hash], async ([moduleName]: [string]) => {
  if( store1.itemsCount === 0 ) {
    // const filters = moduleRefs.description._filters

    // new!
    store1.getAll()
    console.log(store1.$items)

//    store.dispatch(`${moduleName}/getAll`, {
//      filters: {
//        ...filters,
//        ...moduleRefs.filters,
//        ...(!Object.values(filters||{}).find((_) => !!_) ? store.state[moduleName].defaultFilters : {}),
//      },
//    })
  }

}, { immediate: true })


watch(() => metaStore.crud.isInsertVisible, (value: boolean) => {
  if( value === false ) {
    // store.dispatch(`${props.module}/clear`)
    store1.clear()
  }
})

const callAction = () => action(props.module, store, router)

const individualActions = computed(() => {
  return store1.individualActions
    .map((action: any) => ({
      click: (filters: any) => callAction()(action.action, action, filters),
      ...action
    }))
})

const {
  description,
  actions,
  tableDescription,
  availableFilters,
  item,
  items,
  condensedItem,
  selectedIds,
  isLoading,
  fields,
  filters,
  recordsCount,
  recordsTotal,
  currentPage,
  limit

} = toRefs(moduleRefs)
</script>

<style scoped src="./sv-crud.scss"></style>
