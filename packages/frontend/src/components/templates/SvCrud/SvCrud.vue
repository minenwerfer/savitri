<template>
  <sv-box v-if="description.actions" :key="module">
    <template #body>
      <div class="flex gap-2">
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

  <sv-box v-if="Object.keys(availableFilters).length > 0">
    <sv-filter :module="module" :key="module"></sv-filter>
  </sv-box>

  <sv-box>
    <template #body>
      <sv-pagination :module="module" class="mb-2"></sv-pagination>
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
        ></sv-table>
    </template>
  </sv-box>

</template>

<script setup lang="ts">
import { provide, watch, computed, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import useModule from 'frontend/composables/module'
import { SvBox, SvTable, SvForm, SvButton, SvPagination, SvFilter } from 'frontend/components'

const props = defineProps<{
  module: string
}>()

const store = useStore()
const moduleRefs = reactive({})

provide('module', computed(() => props.module))

const isInsertVisible = computed(() => store.getters['meta/isInsertVisible'])
const isInsertReadonly = computed(() => store.getters['meta/isInsertReadonly'])

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

const buttonAction = (action: string, actionProps: any, filter: any) => {
  return actionProps.ask
    ? store.dispatch(`${props.module}/ask`, { action, params: { payload: { filter }}})
    : store.dispatch(`${props.module}/${action}`, { payload: { filter  }})
}

const individualActions = computed(() => {
  return store.getters[`${props.module}/individualActions`]
    .map((action: any) => ({
      name: action.name,
      click: (filter: any) => buttonAction(action.action, action, filter)
    }))
})

const {
  description,
  tableDescription,
  availableFilters,
  item,
  items,
  recordsCount,
  recordsTotal,
  selectedIds,
  isLoading,
  fields,
  getItemIndex

} = toRefs(moduleRefs)
</script>
