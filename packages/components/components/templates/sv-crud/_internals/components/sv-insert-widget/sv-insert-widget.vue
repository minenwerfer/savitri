<template>
  <sv-box
    fixed-right
    v-model:visible="isInsertVisible"
    :title="`${isInsertReadonly ? 'Examinar' : 'Modificar'} ${$t(metaStore.view.collection)}`"
    :key="store.item._id"
  >
    <sv-form
      v-bind="{
        collection: metaStore.view.collection,
        form: store.fields,
        formData: store.item,
        isReadonly: isInsertReadonly,
        layout: store.formLayout
      }"

      @add="$e.preventDefault()"
    ></sv-form>
    <template #extra>
      <sv-icon
        v-clickable
        reactive
        name="ellipsis-h"
      ></sv-icon>
    </template>
    <template #footer>
      <sv-button
        :disabled="store.isLoading || isInsertReadonly"
        @clicked="insert"
      >
        Salvar
      </sv-button>
      <sv-button
        v-if="store.item._id && store.description.methods?.includes('insert')"
        variant="light"
        @clicked="isInsertReadonly = !isInsertReadonly"
      >
        {{ isInsertReadonly ? 'Modificar' : 'Examinar' }}
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

import { isInsertVisible, isInsertReadonly } from '../../store'

const metaStore = useStore('meta')
const store = useStore(metaStore.view.collection)

const insert = async () => {
  await store.deepInsert({
    what: store.item
  })

  isInsertVisible.value = false
}
</script>
