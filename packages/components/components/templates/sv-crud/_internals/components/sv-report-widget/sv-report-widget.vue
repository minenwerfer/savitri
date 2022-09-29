<template>
  <sv-box
    close-hint
    fixed-right
    v-model:visible="isReportVisible" 
    title="Relatório"
    @close="isReportVisible = false"
    @overlay-click="isReportVisible = false"
  >
    <sv-form
      v-if="!reportStore.item._id"
      v-bind="{
        collection: 'report',
        form: reportStore.useFieldsExcept([
          'owner',
          '_collection'
        ]),
        formData: reportStore.item
      }"
    ></sv-form>

    <p v-else>
      Seu relatório foi gerado e retornou {{ reportStore.item.entries_count }} registros.
      Clique <a @click="download">aqui</a> para baixá-lo agora ou faça-o mais tarde através da seção "Relatórios".
    </p>
    <template #footer>
      <sv-button
        v-if="!reportStore.item._id"
        @clicked="requestReport"
      >
        Solicitar
      </sv-button>
      <sv-button v-else @clicked="reportStore.download">
        Baixar
      </sv-button>
    </template>
  </sv-box>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useStore, useParentStore } from '@savitri/web'
import { SvBox, SvForm, SvButton } from '../../../../../..'
import { isReportVisible } from '../../store'

const props = defineProps<{
  collection: string
}>()

const store = useParentStore()

const reportStore = useStore('report')
const metaStore = useStore('meta')

const requestReport = () => {
  return reportStore.insert({
    what: {
      ...reportStore.item,
      _collection: props.collection,
      filters: store.filters
    }
  })
}
</script>
