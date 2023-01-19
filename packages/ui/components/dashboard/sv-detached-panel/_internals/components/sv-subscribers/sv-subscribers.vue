<template>
  <div class="subscribers">
    <div>
      <div
        v-for="subscriber in savedItemStore.item.subscribers"
        :key="subscriber._id"
        class="subscribers__entry"
      >
        <sv-user-picture
          :user="subscriber"
          class="subscribers__picture"
        ></sv-user-picture>

        <div>{{ subscriber.full_name }}</div>
      </div>
    </div>

    <div>
      <sv-form
        v-bind="{
          collection: 'savedItem',
          form: savedItemStore.useProperties(['subscribers']),
          formData: savedItemStore.item,
          omitInputLabels: true
        }"
      ></sv-form>
      <sv-button @clicked="save">Salvar</sv-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '@savitri/web'
import { SvForm, SvButton, SvUserPicture } from '../../../../..'

const savedItemStore = useStore('savedItem')

const save = () => {
  savedItemStore.insert({
    what: savedItemStore.select([
      '_id',
      'subscribers'
    ])
  })
}
</script>

<style scoped src="./sv-subscribers.scss"></style>
