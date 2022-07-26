<template>
  <teleport to="body">
    <sv-box title="Relatório" :float="true" v-model:visible="visible" @close="onClose">
      <template #body>
        <sv-form
          v-if="!reportStore.item._id"
          :form="reportStore.useFieldsExcept(['user_id', 'collection'])"
          :form-data="reportStore.item"
          :gap-y="8"
        ></sv-form>

        <p v-else>
          Seu relatório foi gerado e retornou {{ item.entries_count }} registros.
          Clique <a @click="download">aqui</a> para baixá-lo agora ou faça-o mais tarde através da seção "Relatórios".
        </p>
      </template>
      <template #footer>
        <sv-button v-if="!reportStore.item._id" @clicked="requestReport">Solicitar</sv-button>
        <sv-button v-else @clicked="download">Baixar</sv-button>
      </template>
    </sv-box>
  </teleport>
</template>

<script setup lang="ts">
import { provide, reactive, toRefs } from 'vue'
import { useStore, useParentStore } from '@savitri/web'
import { SvBox, SvForm, SvButton } from '../../../..'

interface Props {
  visible: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>()

const store = useParentStore()
const reportStore = useStore('report')

provide('collection', 'report')

const requestReport = () => {
  return reportStore.insert({
    payload: {
      what: {
        ...reportStore.item,
        collection: props.collection,
        filters: collectionRefs.filters
      }
    }
  })
}

const download = () => {
  reportStore.download({ payload: { filters: reportRefs.item } })
}

const onClose = () => {
  collectionRefs.setItem({})
  emit('update:visible', false)
}
</script>
