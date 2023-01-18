<template>
  <div>
    {{ savedItemStore.item.messages }}
    <sv-form
      v-bind="{
        form: messageStore.properties,
        formData: messageStore.item
      }"
    ></sv-form>

    <sv-button @clicked="pushMessage">
      Oi
    </sv-button>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '@savitri/web'
import { SvForm, SvButton } from '../../../..'

const savedItemStore = useStore('savedItem')
const messageStore = useStore('message')

const pushMessage = () => {
  savedItemStore.functions.pushMessage({
    item: savedItemStore.item._id,
    message: messageStore.condensedItem
  })
}
</script>
