<template>
  <sv-box
    v-model:visible="isFeedbackVisible"
    title="Feedback"
    :float="true"
    @close="$emit('update:visible', false)"
  >
    <template #body>
      <div v-if="!inserted">
        <p class="opacity-60 mb-8">
          Envie absolutamente qualquer coisa.
        </p>

        <sv-form
          :form="store.useFieldsExcept(['user_id'])"
          :form-data="store.item"
        />
      </div>
      <div v-else class="flex justify-between">
        <p>Obrigado por contribuir. Você pode enviar um feedback por sessão.</p>
        <img :src="derpImage" class="w-52 object-contain"/>
      </div>
    </template>

    <template #footer v-if="!inserted">
      <sv-button
        :is-loading="store.isLoading"
        @clicked="insert"
      >
        Enviar
      </sv-button>
    </template>
  </sv-box>
</template>

<script setup lang="ts">
import { ref, provide, inject, defineAsyncComponent } from 'vue'
import { useStore } from '@savitri/web'
import { SvForm, SvButton } from '../../../../..'
import { isFeedbackVisible } from '../../store'

const SvBox = defineAsyncComponent(() => import('../../../../../molecules/sv-box/sv-box.vue'))

const store = useStore('feedback')
provide('storeId', 'feedback')

const inserted = ref(false)
const productVersion = inject('productVersion')
const baseVersion = inject('baseVersion')

const derpImage = ''
const img = new Image()
img.src = derpImage

const insert = async () => {
  await store.insert({
    what: {
      ...store.item,
      base_version: baseVersion,
      product_version: productVersion,
      user_agent: navigator.userAgent
    }

  })

  inserted.value = true
}
</script>
