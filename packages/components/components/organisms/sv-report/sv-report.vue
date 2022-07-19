<template>
  <teleport to="body">
    <sv-box title="Relatório" :float="true" v-model:visible="visible" @close="onClose">
      <template #body>
        <sv-form
          v-if="!item._id"
          :form="useFieldsExcept(['user_id', 'module'])"
          :form-data="item"
          :gap-y="8"
        ></sv-form>

        <div v-else>
          <p>
            Seu relatório foi gerado e retornou {{ item.entries_count }} registros.
            Clique <a class="inline-block font-semibold cursor-pointer" @click="download">aqui</a> para baixá-lo agora ou faça-o mais tarde através da seção "Relatórios".
          </p>
        </div>
      </template>
      <template #footer>
        <sv-button v-if="!item._id" @clicked="requestReport">Solicitar</sv-button>
        <sv-button v-else @clicked="download">Baixar</sv-button>
      </template>
    </sv-box>
  </teleport>
</template>

<script setup lang="ts">
import { provide, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useModule } from '../../../../web'
import { SvBox, SvForm, SvButton } from '../..'

interface Props {
  module: string
  visible: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>()

const store = useStore()
const moduleRefs = reactive(useModule(props.module, store))
const reportRefs = reactive(useModule('report', store))

provide('module', 'report')

const requestReport = () => {
  return store.dispatch('report/insert', {
    payload: {
      what: {
        ...reportRefs.item,
        module: props.module,
        filters: moduleRefs.filters
      }
    }
  })
}

const download = () => {
  store.dispatch('report/download', { payload: { filters: reportRefs.item } })
}

const onClose = () => {
  moduleRefs.setItem({})
  emit('update:visible', false)
}

const {
  item,
  useFieldsExcept

} = toRefs(reportRefs)
</script>
