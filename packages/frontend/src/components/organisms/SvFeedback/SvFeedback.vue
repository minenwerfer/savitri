<template>
  <sv-box title="Feedback" :float="true" @close="$emit('update:visible', false)" v-model:visible="visible">
    <template #body>
      <div v-if="!inserted">
        <p class="opacity-60 mb-8">
          Não perca a chance de depositar a sua dúvida, sugestão ou crítica na caixinha.
          Ela será lida pela equipe responsável em tempo exíguo e resolvida de acordo com a prioridade.
        </p>

        <sv-form
          :form="useFieldsExcept(['user_id'])"
          :form-data="item"
        />
      </div>
      <div v-else class="flex justify-between">
        <p>
          Obrigado por contribuir com o software da Capsul.
          Você pode enviar um feedback por sessão. Deus te abençoe.
        </p>
        <img :src="derpImage" class="w-52 object-contain"/>
      </div>
    </template>

    <template #footer v-if="!inserted">
      <sv-button
        @clicked="insert({ what: { ...item, base_version: baseVersion, product_version: productVersion } }).then(() => { inserted = true })"
        :is-loading="isLoading"
      >
        Enviar
      </sv-button>
    </template>
  </sv-box>
</template>

<script setup lang="ts">
import { ref, provide, inject, defineAsyncComponent } from 'vue'
import { useStore } from 'vuex'
import { SvForm, SvButton } from 'frontend/components'
import useModule from 'frontend/composables/module'

const SvBox = defineAsyncComponent(() => import('frontend/components/molecules/SvBox/SvBox.vue'))

const props = defineProps<{
  visible: boolean
}>()

const store = useStore()
const moduleRefs = useModule('feedback', store)

provide('module', 'feedback')

const inserted = ref(false)
const productVersion = inject('productVersion')
const baseVersion = inject('baseVersion')

const derpImage = 'https://listman.redhat.com/archives/avocado-devel/2015-November/pngF2MCc53SbA.png'
const img = new Image()
img.src = derpImage

const {
  item,
  insert,
  isLoading,
  useFieldsExcept

} = moduleRefs
</script>
