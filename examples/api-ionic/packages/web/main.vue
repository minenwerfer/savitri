<template>
  <div class="main main--default">
    <div class="
      tw-grid
      tw-grid-cols-3
      tw-flex-wrap
      tw-gap-6
      tw-p-8
    ">
      <sv-box>
        <pre>{{ store.description }}</pre>
      </sv-box>

      <sv-box>
        <sv-form
          :key="store.item"
          v-bind="{
            collection: 'person',
            form: store.properties,
            formData: store.item
          }"
        ></sv-form>

        <template #footer>
          <ion-button @click="store.clearItem">
            Clear
          </ion-button>
        </template>
      </sv-box>

      <sv-box>
        <pre>{{ store.item }}</pre>
      </sv-box>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '@savitri/web'
import { SvBox, SvForm } from '@savitri/ui'
import { IonButton } from '@ionic/vue'

const store = useStore('person')
</script>

<style>
body {
  background: #ededed;
}
</style>
