<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap gap-2 overflow-x-auto" v-if="description.actions || $slots.actions" :key="module">
      <sv-button
        v-for="([action, props], index) in Object.entries(description.actions||{})"
        :key="`action-${index}`"
        :disabled="isLoading || selectedIds.length === 0 && props.selection"
        type="neutral"

        :icon="props.unicon"
        @clicked="buttonAction(action, props, { _id: selectedIds })"
      >
        {{ props.name }}
      </sv-button>
      <slot name="actions"></slot>
    </div>

    <teleport to="body">
      <sv-box :title="`${isInsertReadonly ? 'Examinar' : 'Modificar'} ${$t(module)}`" :float="true" v-model:visible="isInsertVisible" @close="store.dispatch('meta/closeCrud')" :classes="`min-w-[40vw] md:mx-[6vw] md:w-8/12 ${Object.keys(fields).length > 8 && 'lg:w-auto'}`">
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

    <sv-box title="Filtrar por" v-if="Object.keys(availableFilters).length > 0" :collapsable="true" :collapsed="true">
      <sv-filter :module="module" :key="module"></sv-filter>
    </sv-box>

    <sv-box class="flex-grow">
      <div class="flex">
        <div class="mr-auto">
          <sv-bare-button @clicked="store.dispatch('meta/spawnReport')" class="text-sm" v-if="description.report">
            <div class="flex items-center gap-x-2">
              <sv-icon name="clipboard" fill="gray" class="w-5 h-5"></sv-icon>
              <div class="h-4 opacity-80">Solicitar relatório</div>
            </div>
          </sv-bare-button>
        </div>
        <div class="flex items-center gap-2 lg:gap-4">
          <sv-records-summary
            :records-count="recordsCount"
            :records-total="recordsTotal"
          ></sv-records-summary>
          <sv-pagination :module="module"></sv-pagination>
        </div>
      </div>
    </sv-box>

    <sv-box :fill="true" :transparent="true">
      <sv-table
        :key="module"
        v-if="tableDescription"
        :checkbox="Object.keys(description.actions||{}).length > 0"
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

        :class="isLoading ? 'opacity-50' : ''"
        ></sv-table>
    </sv-box>

  </div>
</template>

<script setup lang="ts">
import { onUnmounted, provide, watch, computed, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { useModule } from 'frontend/composables'
import {
  SvBox,
  SvTable,
  SvForm,
  SvButton,
  SvPagination,
  SvFilter,
  SvBareButton,
  SvReport,
  SvIcon

} from 'frontend/components'

import SvRecordsSummary from './_internals/components/SvRecordsSummary/SvRecordsSummary.vue'

const props = defineProps<{
  module: string
}>()

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

onUnmounted(() => {
  if( !hash.split(',').includes('refresh') ) {
    return
  }

  const getFilters = () => store.state[props.module]._filters
  const oldFilters = getFilters()
  store.commit(`${props.module}/FILTERS_CLEAR`)

  if( Object.keys(oldFilters).length > 0 )
  {
    const filters = getFilters()
    const changed = Object.entries(oldFilters)
      .some(([key, value]: [string, any]) => filters[key] !== value)

    if( changed ) {
      moduleRefs.clearAll()
    }
  }
})

watch(() => props.module, async (module: string) => {
  if( !store.getters[`${module}/fields`] ) {
    await store.dispatch(`${module}/describe`)
  }

  Object.assign(moduleRefs, useModule(module, store))
  store.dispatch('meta/setViewTitle', module)

  if( moduleRefs.items.length === 0 ) {
    const filters = moduleRefs.description._filters

    store.dispatch(`${module}/getAll`, {
      filters: {
        ...filters,
        ...moduleRefs.filters,
        ...(!Object.values(filters||{}).find((_) => !!_) ? store.state[module].defaultFilters : {}),
      },
    })
  }

}, { immediate: true })


watch(() => isInsertVisible.value, (value: boolean) => {
  if( value === false ) {
    store.dispatch(`${props.module}/clear`)
  }
})

const buttonAction = (action: string, actionProps: any, filters: any) => {
  if( action.split('/')[0] === 'route' ) {
    moduleRefs.setItem(filters)
    return router.push({ name: action.split('/')[1], params: { id: filters._id } })
  }

  return actionProps.ask
    ? store.dispatch(`${props.module}/ask`, { action, params: { payload: { filters }}})
    : store.dispatch(`${props.module}/${action}`, { payload: { filters  }})
}

const individualActions = computed(() => {
  return store.getters[`${props.module}/individualActions`]
    .map((action: any) => ({
      click: (filters: any) => buttonAction(action.action, action, filters),
      ...action
    }))
})

const {
  description,
  tableDescription,
  availableFilters,
  item,
  items,
  condensedItem,
  recordsCount,
  recordsTotal,
  selectedIds,
  isLoading,
  fields,
  getItemIndex

} = toRefs(moduleRefs)
</script>
