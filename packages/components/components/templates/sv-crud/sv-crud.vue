<template>
  <div class="crud">
    <div class="crud__panel">
      <div class="crud__panel-control">
        <sv-filter-widget v-bind="{
          module,
          availableFilters,
          filters
        }"></sv-filter-widget>
        <sv-button
          icon="export"
          type="neutral"
          variant="light"
          @clicked="store.dispatch('meta/spawnReport')"
          v-if="description.report"
        >
          Exportar
        </sv-button>
      </div>
      <div class="crud__panel-control" v-if="actions || $slots.actions" :key="module">
        <sv-button
          v-for="([action, props], index) in Object.entries(actions||{})"
          :key="`action-${index}`"
          :disabled="isLoading || selectedIds.length === 0 && props.selection"
          type="neutral"

          :icon="props.unicon"
          @clicked="callAction()(action, props, { _id: selectedIds })"
        >
          {{ props.name }}
        </sv-button>
        <slot name="actions"></slot>
      </div>
    </div>

    <teleport to="body">
      <sv-box
        :title="`${isInsertReadonly ? 'Examinar' : 'Modificar'} ${$t(module)}`"
        :float="true"
        v-model:visible="isInsertVisible"
        @close="store.dispatch('meta/closeCrud')"
        :classes="`min-w-[40vw] md:mx-[6vw] md:w-8/12 ${Object.keys(fields).length > 8 && 'lg:w-auto'}`">
        <template #body>
          <sv-form
            :form="fields"
            :form-data="item"
            @add="$e.preventDefault()"

            :is-readonly="isInsertReadonly"
            :key="`${item._id ? item._id : 'form'}`"
            :item-index="getItemIndex(item)"
            :flex="description.flex"
            >
          </sv-form>
        </template>
        <template #footer v-if="!isInsertReadonly">
          <sv-button :disabled="isLoading" @clicked="store.dispatch(`${module}/deepInsert`, { what: item, __crudClose: true })">
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
        :key="module"
        v-if="tableDescription"
        :checkbox="hasSelectionActions"
        :columns="{
          ...tableDescription,
          ...(individualActions.length > 0
            ? {
              __custom: {
                label: 'Ações',
                actions: individualActions
              }
            } : {}
          )
        }"

        :rows="items"
        :recordsCount="recordsCount"
        :recordsTotal="recordsTotal"

        :row-color="description.rowColor"
        :class="isLoading && 'opacity-50'"
      ></sv-table>
      <div
        v-if="items.length === 0 && !isLoading"
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
  onUnmounted,
  provide,
  watch,
  computed,
  reactive,
  toRefs

} from 'vue'

import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { useModule } from '../../../../frontend'
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

interface Props {
  module: string
}

const props = defineProps<Props>()

const store = useStore()
const router = useRouter()
const { hash } = useRoute()
const moduleRefs = reactive({})

provide('module', computed(() => props.module))

const isInsertVisible = computed(() => store.getters['meta/isInsertVisible'])
const isInsertReadonly = computed(() => store.getters['meta/isInsertReadonly'])

const isReportVisible = computed({
  get: () => store.state.meta.report.isVisible,
  set: (value: boolean) => store.dispatch(`meta/${value ? 'spawn' : 'close'}Report`)
})

const hasSelectionActions = computed(() => {
  return Object.values(moduleRefs.actions||{})
    .some((action: any) => !!action.selection)
})

onUnmounted(() => {
  if( !hash.slice(1).split(',').includes('refresh') ) {
    return
  }

  const getFilters = () => store.state[props.module]._filters
  const oldFilters = getFilters()
  store.commit(`${props.module}/FILTERS_CLEAR`)

  if( Object.keys(oldFilters).length > 0 ) {
    const filters = getFilters()
    const changed = Object.entries(oldFilters)
      .some(([key, value]: [string, any]) => filters[key] !== value)

    if( changed ) {
      moduleRefs.clearAll()
    }
  }
})

watch(() => [props.module, hash], async ([moduleName]: [string]) => {
  if( !store.getters[`${moduleName}/fields`] ) {
    await store.dispatch(`${moduleName}/describe`)
  }

  Object.assign(moduleRefs, useModule(moduleName, store))
  store.dispatch('meta/setViewTitle', moduleName)

  if( moduleRefs.items.length === 0 ) {
    const filters = moduleRefs.description._filters

    store.dispatch(`${moduleName}/getAll`, {
      filters: {
        ...filters,
        ...moduleRefs.filters,
        ...(!Object.values(filters||{}).find((_) => !!_) ? store.state[moduleName].defaultFilters : {}),
      },
    })
  }

}, { immediate: true })


watch(() => isInsertVisible.value, (value: boolean) => {
  if( value === false ) {
    store.dispatch(`${props.module}/clear`)
  }
})

const callAction = () => action(props.module, store, router)

const individualActions = computed(() => {
  return store.getters[`${props.module}/individualActions`]
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
  getItemIndex,
  filters,
  recordsCount,
  recordsTotal,
  currentPage,
  limit

} = toRefs(moduleRefs)
</script>

<style scoped src="./sv-crud.scss"></style>
