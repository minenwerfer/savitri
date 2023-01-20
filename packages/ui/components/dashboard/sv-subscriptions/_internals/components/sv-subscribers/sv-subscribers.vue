<template>
  <div class="subscribers">
    <div>
      <div
        v-for="subscriber in subscriptionStore.item.subscribers"
        :key="subscriber._id"
        class="subscribers__entry"
      >
        <sv-user-picture
          :user="subscriber"
          class="subscribers__picture"
        ></sv-user-picture>

        <div>{{ subscriber.full_name }}</div>
        <sv-icon
          v-clickable
          v-if="
            subscriptionStore.item.owner._id === userStore.$currentUser._id
              && subscriber._id !== userStore.$currentUser._id
          "
          reactive
          name="trash"
          style="margin-left: auto"
          @click="pullSubscriber(subscriber._id)"
        ></sv-icon>
      </div>
      <div
        v-clickable
        class="subscribers__entry"
        @click="addVisible = true"
      >
        <div
          class="
            subscribers__picture
            subscribers__picture--new
        ">
          <sv-icon name="plus"></sv-icon>
        </div>
        <div>Novo</div>
      </div>
    </div>

    <div v-if="addVisible">
      <sv-form
        v-bind="{
          collection: 'subscription',
          form: subscriptionStore.useProperties(['subscribers']),
          formData,
          omitInputLabels: true
        }"
      >
        <template #footer>
          <sv-button @clicked="save">Salvar</sv-button>
        </template>
      </sv-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useStore } from '@savitri/web'
import {
  SvForm,
  SvButton,
  SvUserPicture,
  SvIcon

} from '../../../../..'

const subscriptionStore = useStore('subscription')
const userStore = useStore('user')

const addVisible = ref(false)
const formData = reactive({
  subscribers: []
})

const save = () => {
  subscriptionStore.functions.pushSubscribers({
    _id: subscriptionStore.item._id,
    subscribers: formData.subscribers
  })

  addVisible.value = false
}

const pullSubscriber = (subscriber: string) => {
  subscriptionStore.functions.pullSubscribers({
    _id: subscriptionStore.item._id,
    subscribers: [subscriber]
  })
}
</script>

<style scoped src="./sv-subscribers.scss"></style>
