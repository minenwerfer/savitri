<template>
  <sv-box title="Vamos de feedback?" :float="true" @close="$emit('update:visible', false)" v-model:visible="visible">

    <template #body>
      <div v-if="!inserted">
        <p class="opacity-60 mb-8">
          Não perca a chance de depositar a sua dúvida, sugestão ou crítica na caixinha.
          Ela será lida pela equipe responsável e resolvida em tempo exíguo.
        </p>

        <sv-form
          :form="useFieldsExcept(['user_id'])"
          :form-data="item"
        />
      </div>
      <div v-else>
        Obrigado! A sua opinião é muito importante.
      </div>
    </template>

    <template #footer v-if="!inserted">
      <sv-button
        @clicked="insert({ what: { ...item, baseVersion, productVersion } }).then(() => { inserted = true })"
        :is-loading="isLoading"
      >
        Enviar
      </sv-button>
    </template>
  </sv-box>
</template>

<script setup lang="ts">
import { ref, inject, defineAsyncComponent } from 'vue'
import { useStore } from 'vuex'
import { SvForm, SvButton } from 'frontend/components'
import useModule from 'frontend/composables/module'

const SvBox = defineAsyncComponent(() => import('frontend/components/molecules/SvBox/SvBox.vue'))

const props = defineProps<{
  visible: boolean
}>()

const store = useStore()
const moduleRefs = useModule('feedback', store)

const inserted = ref(false)
const productVersion = inject('productVersion')
const baseVersion = inject('baseVersion')

const {
  item,
  insert,
  isLoading,
  useFieldsExcept

} = moduleRefs
</script>
