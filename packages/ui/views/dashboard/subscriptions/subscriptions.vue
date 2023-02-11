<template>
  <div class="subscriptions">
    <sv-box>
      <div class="subscriptions__list">
        <div>Suas inscrições</div>
        <div class="subscriptions__entries">
          <div
            v-clickable
            v-for="subscription in subscriptions"
            :key="subscription._id"
            class="subscriptions__entry"

            @click="subscriptionStore.get({
              filters: {
                _id: subscription._id
              }
            })"
          >
            <div>
              <strong>{{ subscription.description }}</strong>
              <sv-icon small name="user-circle">{{ subscription.owner.name }}</sv-icon>
              <sv-icon small name="calendar-alt">{{ subscription.updated_at.formatDateTime(true) }}</sv-icon>
            </div>
            <!-- <pre>{{ subscription }}</pre> -->

            <div v-if="
              subscription.messages?.[0]
              && !subscription.messages?.[0]?.viewers?.find(({ _id }) => _id === currentUser._id)
            ">
              Oi
            </div>
          </div>
        </div>
      </div>
    </sv-box>

    <sv-box style="flex: 1">
      <div class="subscriptions__content">
        <sv-messages
          v-if="subscriptionStore.item._id"
          v-model="subscriptionStore.item"
          no-border
        ></sv-messages>
      </div>
    </sv-box>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useStore } from '@savitri/web'
import { SvBox, SvIcon, SvMessages } from '../../../components'

const subscriptionStore = useStore('subscription')

const subscriptions = computed(() => {
  return subscriptionStore.items
    .sort((a, b) => a.created_at > b.created_at ? -1 : 1)
})

onMounted(() => {
  subscriptionStore.clearItem()
  subscriptionStore.getAll()
})
</script>

<style scoped src="./subscriptions.scss"></style>
