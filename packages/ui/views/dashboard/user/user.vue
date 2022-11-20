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
        variant="transparent"
        @clicked="extraPanel = false"
      >
        Cancelar
      </sv-button>
      <sv-button
        large
        @clicked="insertExtra"
      >
        Salvar
      </sv-button>
    </template>
  </sv-box>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { hasStore, useStore } from '../../../../web'
import {
  SvCrud,
  SvBox,
  SvForm,
  SvButton

} from '../../..'

const userStore = useStore('user')
const userExtraStore = hasStore('userExtra')
  ? useStore('userExtra')
  : null

const extraPanel = ref(false)

const handleUiEvent = async (event: any) => {
  userStore.setItem(event.params.filters)

  if( event.name === 'spawnExtra' && userExtraStore ) {
    await userExtraStore.get(
      { filters: { owner: event.params.filters._id } },
      { unproxied: true }

    ).catch(userExtraStore.clearItem)
    
    extraPanel.value = true
  }
}

const insertExtra = async () => {
  await userExtraStore.insert({
    what: {
      ...userExtraStore.condensedItem,
      owner: userStore.item._id
    }
  })

  extraPanel.value = false
}
</script>
