<template>
  <sv-box
    close-hint
    v-model:visible="isFeedbackVisible"
    title="Feedback"
    :float="true"
    @close="$emit('update:visible', false)"
  >
    <div v-if="!inserted">
      <p>
        Envie absolutamente qualquer coisa.
      </p>

      <sv-form
        v-bind="{
          collection: 'feedback',
          form: store.useFieldsExcept(['owner']),
          formData: store.item
        }"
      />
    </div>
    <p v-else>
      Obrigado por contribuir. Você pode enviar um feedback por sessão.
    </p>

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
import { ref, inject } from 'vue'
import { useStore } from '@savitri/web'
import { SvBox, SvForm, SvButton } from '../../../../../components'
import { isFeedbackVisible } from '../../store'

const store = useStore('feedback')

const inserted = ref(false)
const productVersion = inject('productVersion')
const baseVersion = inject('baseVersion')

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
