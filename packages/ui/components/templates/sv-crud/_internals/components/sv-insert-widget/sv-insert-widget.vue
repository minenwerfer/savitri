<template>
  <sv-box
    fixed-right
    v-model:visible="isInsertVisible"
    :title="`${isInsertReadOnly ? 'Examinar' : 'Modificar'} ${$t(metaStore.view.collection)}`"
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

      @add="$event.preventDefault()"
    ></sv-form>
    <template #extra>
      <sv-context-menu
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
      </sv-context-menu>
    </template>
    <template #footer>
      <sv-button
        small
        variant="transparent"
        @clicked="cancel"
      >
        {{ $t('action.cancel') }}
      </sv-button>
      <sv-button
        :disabled="!store.insertReady || isInsertReadOnly"
        @clicked="insert"
      >
      {{ $t('action.insert') }}
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
  SvContextMenu,
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

// unused
const isInsertReadOnly = false

const parentStore = inject<CollectionStore<any>>('parentStore')

const insert = async () => {
  const result = await store.deepInsert()

  if( props.parentField ) {
    const newSet = parentStore!.item[props.parentField] ||= []
    if( newSet.findIndex(({ _id }:{ _id: string }) => _id === result._id) === -1 ) {
      newSet.push(result._id)
    }

    await parentStore!.insert({
      what: {
        _id: parentStore!.item._id,
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
