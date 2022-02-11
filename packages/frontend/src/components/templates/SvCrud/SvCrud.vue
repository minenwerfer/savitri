<template>
  <sv-box v-if="description.actions" :key="module">
    <template #body>
      <div class="flex gap-2 w-screen overflow-x-auto">
        <sv-button
          v-for="([action, props], index) in Object.entries(description.actions||{})"
          :key="`action-${index}`"
          :disabled="isLoading || selectedIds.length === 0 && props.selection"
          type="neutral"

          @clicked="buttonAction(action, props, { _id: selectedIds })"
        >
          {{ props.name }}
        </sv-button>
      </div>
    </template>
  </sv-box>

  <sv-box :title="`${isInsertReadonly ? 'Examinar' : 'Modificar'} ${$t(module)}`" :float="true" v-model:visible="isInsertVisible" @close="store.dispatch('meta/closeCrud')" classes="min-w-[40vw] md:mx-[10vw] md:w-8/12 lg:w-auto">
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

  <sv-report :module="module" v-model:visible="isReportVisible"></sv-report>

  <sv-box title="Filtrar por" v-if="Object.keys(availableFilters).length > 0" :collapsable="true" :collapsed="true">
    <sv-filter :module="module" :key="module"></sv-filter>
  </sv-box>

  <sv-box class="flex-grow">
    <div class="flex">
      <div class="mr-auto">
        <sv-bare-button @clicked="store.dispatch('meta/spawnReport')" class="opacity-80 text-sm" v-if="description.report">
          <div class="flex items-center gap-x-1">
            <unicon name="clipboard" fill="black" class="w-5 h-5"></unicon>
            <div>Solicitar relatório</div>
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

</template>

<script setup lang="ts">
import { provide, watch, computed, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import useModule from 'frontend/composables/module'
import {
  SvBox,
  SvTable,
  SvForm,
  SvButton,
  SvPagination,
  SvFilter,
  SvBareButton,
  SvReport

} from 'frontend/components'

import SvRecordsSummary from './_internals/components/SvRecordsSummary/SvRecordsSummary.vue'

const props = defineProps<{
  module: string
}>()

const store = useStore()
const moduleRefs = reactive({})

provide('module', computed(() => props.module))

const isInsertVisible = computed(() => store.getters['meta/isInsertVisible'])
const isInsertReadonly = computed(() => store.getters['meta/isInsertReadonly'])

const isReportVisible = computed({
  get: () => store.state.meta.report.isVisible,
  set: (value: boolean) => store.dispatch(`meta/${value ? 'spawn' : 'close'}Report`)
})

watch(() => props.module, async (module: string) => {

  if( !store.getters[`${module}/fields`] ) {
    await store.dispatch(`${module}/describe`)
  }

  Object.assign(moduleRefs, useModule(module, store))
  store.dispatch('meta/setViewTitle', module)
  store.dispatch(`${module}/getAll`, {
    filters: moduleRefs.filters
  })

}, { immediate: true })


watch(() => isInsertVisible.value, (value: boolean) => {
  if( value === false ) {
    store.dispatch(`${props.module}/clear`)
  }
})

const actionColors = {
  'remove': 'red',
}

const buttonAction = (action: string, actionProps: any, filters: any) => {
  return actionProps.ask
    ? store.dispatch(`${props.module}/ask`, { action, params: { payload: { filters }}})
    : store.dispatch(`${props.module}/${action}`, { payload: { filters  }})
}

const individualActions = computed(() => {
  return store.getters[`${props.module}/individualActions`]
    .map((action: any) => ({
      color: actionColors[action.action] || 'blue',
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
