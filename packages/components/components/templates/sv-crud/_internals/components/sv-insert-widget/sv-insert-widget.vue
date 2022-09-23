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
      <sv-icon
        v-clickable
        v-if="store.item._id"
        reactive
        name="ellipsis-h"
      ></sv-icon>
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
import { useStore } from '@savitri/web'
import {
  SvBox,
  SvForm,
  SvButton,
  SvIcon
  
} from '@savitri/components'

import { isInsertVisible, isInsertReadOnly } from '../../store'

const metaStore = useStore('meta')
const store = useStore(metaStore.view.collection)

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
</script>
