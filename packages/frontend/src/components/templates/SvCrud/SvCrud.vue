<template>
  <sv-box v-if="description.actions" :key="module">
    <template #body>
      <div class="flex gap-2 md:w-screen overflow-x-scroll">
        <sv-button
          v-for="([action, props], index) in Object.entries(description.actions)"
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

  <sv-box :title="`${isInsertReadonly ? 'Examinar' : 'Modificar'} ${$t(module)}`" :float="true" v-model:visible="isInsertVisible" @close="store.dispatch('meta/closeCrud')" classes="md:w-8/12 lg:w-6/12">
    <template #body>
      <sv-form
        :form="fields"
        :form-data="item"
        @add="$e.preventDefault()"

        :is-readonly="isInsertReadonly"
        :key="`${item._id ? item._id : 'form'}`"
        :item-index="getItemIndex(item)"
        >
      </sv-form>
    </template>
    <template #footer v-if="!isInsertReadonly">
      <sv-button :disabled="isLoading" @clicked="store.dispatch(`${module}/deepInsert`, { what: item, __crudClose: true })">
        Salvar
      </sv-button>
    </template>
  </sv-box>

  <sv-box title="Relatório" :float="true" v-model:visible="isReportVisible" @close="isReportVisible = false">
    <template #body>
      <sv-form
        :form="reportRefs.useFieldsExcept(['module'])"
        :form-data="reportRefs.item"
        :gap-y="8"
      ></sv-form>
    </template>
    <template #footer>
      <sv-button @clicked="requestReport">Solicitar</sv-button>
    </template>
  </sv-box>

  <sv-box title="Filtrar por" v-if="Object.keys(availableFilters).length > 0" :collapsable="true" :collapsed="true">
    <sv-filter :module="module" :key="module"></sv-filter>
  </sv-box>

  <sv-box>
    <template #body>
      <div class="flex mb-2">
        <div class="mr-auto">
          <sv-bare-button @clicked="isReportVisible = true" class="opacity-80 text-sm" v-if="description.report">
            Solicitar relatório
          </sv-bare-button>
        </div>
        <sv-pagination :module="module"></sv-pagination>
      </div>
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

        :class="isLoading ? 'opacity-50' : ''"
        ></sv-table>
    </template>
  </sv-box>

</template>

<script setup lang="ts">
import { provide, watch, computed, reactive, ref, toRefs } from 'vue'
import { useStore } from 'vuex'
import useModule from 'frontend/composables/module'
import { SvBox, SvTable, SvForm, SvButton, SvPagination, SvFilter, SvBareButton } from 'frontend/components'

const props = defineProps<{
  module: string
}>()

const store = useStore()
const moduleRefs = reactive({})
const reportRefs = reactive(useModule('report', store))

provide('module', computed(() => props.module))

const isInsertVisible = computed(() => store.getters['meta/isInsertVisible'])
const isInsertReadonly = computed(() => store.getters['meta/isInsertReadonly'])
const isReportVisible = ref(false)

watch(() => props.module, async (module: string) => {

  if( !store.getters[`${module}/fields`] ) {
    await store.dispatch(`${module}/describe`)
  }

  Object.assign(moduleRefs, useModule(module, store))
  store.dispatch('meta/setViewTitle', module)
  store.dispatch(`${module}/getAll`)

}, { immediate: true })


watch(() => isInsertVisible.value, (value: boolean) => {
  if( value === false ) {
    store.dispatch(`${props.module}/clear`)
  }
})

const buttonAction = (action: string, actionProps: any, filters: any) => {
  return actionProps.ask
    ? store.dispatch(`${props.module}/ask`, { action, params: { payload: { filters }}})
    : store.dispatch(`${props.module}/${action}`, { payload: { filters  }})
}

const individualActions = computed(() => {
  return store.getters[`${props.module}/individualActions`]
    .map((action: any) => ({
      name: action.name,
      click: (filters: any) => buttonAction(action.action, action, filters)
    }))
})

const requestReport = () => {
  return store.dispatch('report/insert', {
    payload: {
      what: {
        ...reportRefs.item,
        module: props.module,
        filters: moduleRefs.filters
      }
    }
  }).then(async () => {
    await store.dispatch('meta/spawnModal', {
      title: 'Relatório solicitado',
      body: 'Você pode baixá-lo na seção "Relatórios".'
    })

    isReportVisible.value = false

  })
}

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
