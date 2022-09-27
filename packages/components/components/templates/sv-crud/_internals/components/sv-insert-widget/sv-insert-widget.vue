<template>
  <sv-box
    fixed-right
    v-model:visible="isInsertVisible"
    :title="`${isInsertReadOnly ? 'Examinar' : 'Modificar'} ${$t(metaStore.view.collection)}`"
    :key="store.item._id"
    @overlay-click="cancel"
  >
    <sv-form
      v-bind="{
        collection: metaStore.view.collection,
        form: store.fields,
        formData: store.item,
        isReadOnly: isInsertReadOnly,
        layout: store.formLayout
      }"

      @add="$e.preventDefault()"
    ></sv-form>
    <template #extra>
      <sv-dropdown v-bind="{
        subject: store.item,
        actions: individualActions
          .filter(({ action }) => action !== 'ui/spawnEdit')
      }">
        <sv-icon
          v-clickable
          v-if="store.item._id"
          reactive
          name="ellipsis-h"
        ></sv-icon>
      </sv-dropdown>
    </template>
    <template #footer>
      <sv-button
        variant="transparent"
        size="small"
        @clicked="cancel"
      >
        Cancelar
      </sv-button>
      <sv-button
        :disabled="store.isLoading || isInsertReadOnly"
        @clicked="insert"
      >
        Salvar
      </sv-button>
    </template>
  </sv-box>
</template>

<script setup lang="ts">
import { inject, watch } from 'vue'
import { useStore } from '@savitri/web'
import {
  SvBox,
  SvForm,
  SvButton,
  SvDropdown,
  SvIcon
  
} from '@savitri/components'

import { isInsertVisible, isInsertReadOnly } from '../../store'

const metaStore = useStore('meta')
const store = useStore(metaStore.view.collection)

const individualActions = inject('individualActions')

const insert = async () => {
  await store.deepInsert({
    what: store.item
  })

  isInsertVisible.value = false
}

const cancel = () => {
  store.ask({
    action: () => {
      store.clearItem()
      isInsertVisible.value = false
    },
    body: 'Deseja mesmo fechar o painel sem salvar as suas alterações?'
  })
}

watch(() => store.item._id, (_id: string|null) => {
  if( _id === null ) {
    isInsertVisible.value = false
    store.clearItem()
  }
})
</script>
