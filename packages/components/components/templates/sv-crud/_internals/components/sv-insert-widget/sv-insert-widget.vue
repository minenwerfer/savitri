<template>
  <teleport to="body">
    <sv-box
      v-model:visible="isInsertVisible"
      v-if="metaStore.view.collection.length > 0"
      :title="`${isInsertReadonly ? 'Examinar' : 'Modificar'} ${$t(metaStore.view.collection)}`"
      :float="true"
      :key="metaStore.view.collection"
    >
      <sv-form
        :key="store.item._id"
        v-bind="{
          collection: metaStore.view.collection,
          form: store.fields,
          formData: store.item,
          isReadonly: isInsertReadonly
        }"

        @add="$e.preventDefault()"
      ></sv-form>
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
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useStore } from '@savitri/web'
import { SvBox, SvForm, SvButton } from '@savitri/components'
import {
  isInsertVisible,
  isInsertReadonly,

} from '../../store'

const store = reactive({})
const metaStore = useStore('meta')

watch(() => metaStore.view.collection, (collection: string) => {
  if( collection ) {
    Object.assign(store, useStore(collection))
  }

}, { immediate: true })
</script>
