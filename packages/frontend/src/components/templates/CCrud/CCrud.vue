<template>
  <c-box v-if="description.actions">
    <template #body>
      <div class="flex gap-2">
        <c-button
          v-for="([action, props], index) in Object.entries(description.actions)"
          :key="`action-${index}`"
          :disabled="isLoading || selectedIds.length === 0 && props.selection"
          type="neutral"
          @clicked="buttonAction(action, props, { _id: selectedIds })"
        >
          {{ props.name }}
        </c-button>
      </div>
    </template>
  </c-box>

  <c-box :title="`${isInsertReadonly ? 'Examinar' : 'Modificar'} ${$t(module)}`" :float="true" v-model:visible="isInsertVisible" @close="store.dispatch('meta/closeCrud')" classes="md:w-4/12 lg:w-5/12">
    <template #body>
      <c-form
        :form-data="item"
        :form="fields"
        @add="$e.preventDefault()"

        :is-readonly="isInsertReadonly"
        :key="`${item._id ? item._id : 'form'}`"
        >
      </c-form>
    </template>
    <template #footer v-if="!isInsertReadonly">
      <c-button :disabled="isLoading" @clicked="store.dispatch(`${module}/deepInsert`, { what: item, __crudClose: true })">
        Salvar
      </c-button>
    </template>
  </c-box>

  <c-box v-if="Object.keys(availableFilters).length > 0">
    <c-filter :module="module" :key="module"></c-filter>
  </c-box>

  <c-box>
    <template #body>
      <c-pagination :module="module" class="mb-2"></c-pagination>
      <c-table
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
        ></c-table>
    </template>
  </c-box>

</template>

<script>
import { provide, watch, computed, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import useModule from 'frontend/composables/module'
import { CBox, CTable, CForm, CButton, CPagination, CFilter } from 'frontend/components'

export default {
  props: {
    module: {
      type: String,
      required: true,
    }
  },

  components: {
    CBox,
    CTable,
    CForm,
    CButton,
    CPagination,
    CFilter
  },

  setup(props) {
    // eslint-disable-next-line
    const store = useStore()
    const module = reactive({})

    provide('module', computed(() => props.module))

    watch(() => props.module, async () => {
      if( !store.getters[`${props.module}/fields`] ) {
        await store.dispatch(`${props.module}/describe`)
      }

      Object.assign(module, useModule(props.module, store))
      store.dispatch('meta/setViewTitle', props.module)
      store.dispatch(`${props.module}/getAll`)

    }, { immediate: true })

    const buttonAction = (action, actionProps, filter) => {
      return actionProps.ask
        ? store.dispatch(`${props.module}/ask`, { action, params: { payload: { filter }}})
        : store.dispatch(`${props.module}/${action}`, { payload: { filter  }})
    }

    const individualActions = computed(() => {
      return store.getters[`${props.module}/individualActions`]
        .map((action) => ({
          name: action.name,
          click: filter => buttonAction(action.action, action, filter)
        }))
    })

    return {
      store,
      ...toRefs(module),
      isInsertVisible: computed(() => store.getters['meta/isInsertVisible']),
      isInsertReadonly: computed(() => store.getters['meta/isInsertReadonly']),
      buttonAction,
      individualActions,
    }
  },

  watch: {
    isInsertVisible(value) {
      if( value === false ) {
        this.store.dispatch(`${this.module}/clear`)
      }
    },
  }
}
</script>
