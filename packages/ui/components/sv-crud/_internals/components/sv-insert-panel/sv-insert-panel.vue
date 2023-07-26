<script setup lang="ts">
import { inject, watch } from 'vue'
import { useStore, CollectionStore } from '@savitri/web'

import SvBox from '../../../../sv-box/sv-box.vue'
import SvForm from '../../../../form/sv-form/sv-form.vue'
import SvButton from '../../../../sv-button/sv-button.vue'
import SvContextMenu from '../../../../sv-context-menu/sv-context-menu.vue'
import SvIcon from '../../../../sv-icon/sv-icon.vue'

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

<template>
  <sv-box
    fixed-right
    v-model="isInsertVisible"
    @overlay-click="cancel"
  >
    <template #header>
      <span>{{
        (() => {
          switch( isInsertVisible ) {
            case 'add':
              return $t('action.add')
            case 'duplicate':
              return $t('action.duplicate')
            case 'edit':
            default:
              return $t('action.edit')
          }
        })() }}
      </span>
      <span>&nbsp;{{ $t(metaStore.view.collection) }}</span>
    </template>

    <sv-form
      v-model="store.item"
      v-bind="{
        collection: metaStore.view.collection,
        form: store.properties,
        isReadOnly: isInsertReadOnly,
        layout: store.formLayout
      }"

      @add="$event.preventDefault()"
    >
      <template
        v-for="slotName in Object.keys($slots).filter(key => key.startsWith('field-'))"
        v-slot:[slotName]="slotProps"
      >
        <slot
          v-bind="slotProps"
          :name="slotName"
        ></slot>
      </template>
    </sv-form>
    <template #extra>
      <sv-context-menu
        v-bind="{
          subject: store.item,
          actions: individualActions
            .filter(({ action }) => action !== 'ui/spawnEdit')
        }"
        @action-click="isInsertVisible = false"
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
        @click="cancel"
      >
        {{ $t('action.cancel') }}
      </sv-button>
      <sv-button
        :disabled="!store.insertReady || isInsertReadOnly"
        :loading="store.loading.insert"
        @click="insert"
      >
      {{ $t('action.insert') }}
      </sv-button>
    </template>
  </sv-box>
</template>

