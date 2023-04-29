<script setup lang="ts">
import { ref } from 'vue'
import { hasStore, useStore } from '@savitri/web'

import SvCrud from '../../../components/sv-crud/sv-crud.vue'
import SvBox from '../../../components/sv-box/sv-box.vue'
import SvForm from '../../../components/form/sv-form/sv-form.vue'
import SvButton from '../../../components/sv-button/sv-button.vue'

const userStore = useStore('user')
const userExtraStore = hasStore('userExtra')
  ? useStore('userExtra')
  : null

const extraPanel = ref(false)

const handleUiEvent = async (event: any) => {
  userStore.setItem(event.params)

  if( event.name === 'spawnExtra' && userExtraStore ) {
    await userExtraStore.get(
      { filters: { owner: event.params._id } },
      { unproxied: true }

    ).catch(userExtraStore.clearItem)
    
    extraPanel.value = true
  }
}

const insertExtra = async () => {
  await userExtraStore.deepInsert({
    what: {
      ...userExtraStore.diffedItem,
      owner: userStore.item._id
    }
  })

  extraPanel.value = false
}
</script>

<template>
  <sv-crud
    collection="user"
    @ui-event="handleUiEvent"
  ></sv-crud>

  <sv-box
    close-hint
    fixed-right
    title="Detalhes"
    v-model:visible="extraPanel"
    @overlay-click="extraPanel = false"
  >
    <sv-form
      v-bind="{
        collection: 'userExtra',
        form: userExtraStore.properties,
        formData: userExtraStore.item
      }"
    ></sv-form>

    <template #footer>
      <sv-button
        small
        variant="transparent"
        @click="extraPanel = false"
      >
        Cancelar
      </sv-button>
      <sv-button @click="insertExtra">
        Salvar
      </sv-button>
    </template>
  </sv-box>
</template>

