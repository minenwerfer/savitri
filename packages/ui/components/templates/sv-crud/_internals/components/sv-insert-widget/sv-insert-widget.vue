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
        form: store.properties,
        formData: store.item,
        isReadOnly: isInsertReadOnly,
        layout: store.formLayout
      }"

      @add="$e.preventDefault()"
    ></sv-form>
    <template #extra>
      <sv-dropdown
        v-bind="{
          subject: store.item,
          actions: individualActions
            .filter(({ action }) => action !== 'ui/spawnEdit')
        }"
        @action-clicked="isInsertVisible = false"
      >
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
        @clicked="cancel"
      >
        Cancelar
      </sv-button>
      <sv-button
        large
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
import type { CollectionStore } from '../../../../../../../web'
import { useStore } from '../../../../../../../web'
import {
  SvBox,
  SvForm,
  SvButton,
  SvDropdown,
  SvIcon
  
} from '../../../../..'

import { isInsertVisible } from '../../store'

const props = defineProps<{
  parentCollection?: string
  parentField?: string
}>()

const metaStore = useStore('meta')
const store = useStore(metaStore.view.collection)
const individualActions = inject('individualActions', [])

const parentStore = inject('parentStore')

const insert = async () => {
  const result = await store.deepInsert({
    what: store.item
  })

  if( props.parentField ) {
    const newSet = parentStore.item[props.parentField] ||= []
    if( newSet.findIndex(({ _id }) => _id === result._id) === -1 ) {
      newSet.push(result._id)
    }

    await parentStore.insert({
      what: {
        _id: parentStore.item._id,
        [props.parentField]: newSet
      }
    })
  }

  isInsertVisible.value = false
}

const cancel = () => {
  store.ask({
    action: () => {
      store.clearItem()
      store.validationErrors = {}
      isInsertVisible.value = false
    },
    body: I18N.global.tc('prompt.close_panel')
  })
}

watch(() => store.item._id, (_id) => {
  if( _id === null ) {
    isInsertVisible.value = false
  }
})
</script>
