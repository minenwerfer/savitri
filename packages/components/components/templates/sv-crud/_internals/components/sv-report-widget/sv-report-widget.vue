<template>
  <teleport to="body">
    <sv-box
      v-model:visible="isReportVisible" 
      title="Relatório"
      :float="true"
      @close="onClose"
    >
      <template #body>
        <sv-form
          v-if="!reportStore.item._id"
          :form="reportStore.useFieldsExcept(['user_id', 'collection'])"
          :form-data="reportStore.item"
          :gap-y="8"
        ></sv-form>

        <p v-else>
          Seu relatório foi gerado e retornou {{ reportStore.item.entries_count }} registros.
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
import { provide, reactive } from 'vue'
import { useStore, useParentStore } from '@savitri/web'
import { SvBox, SvForm, SvButton } from '../../../../../..'
import { isReportVisible } from '../../store'

const store = useParentStore()
const reportStore = useStore('report')
const metaStore = useStore('meta')

provide('storeId', 'report')

const requestReport = () => {
  return reportStore.insert({
    payload: {
      what: {
        ...reportStore.item,
        collection: props.collection,
        filters: store.filters
      }
    }
  })
}

const download = () => {
  reportStore.download({ payload: { filters: reportStore.item } })
}

const onClose = () => {
  store.clearItem()
  isReportVisible.value = false
}
</script>
