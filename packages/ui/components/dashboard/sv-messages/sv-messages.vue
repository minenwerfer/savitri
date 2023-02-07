<template>
  <sv-group :no-border="noBorder">
    <sv-box :fill="noBorder">
      <div
        :style="
          noBorder
            ? 'margin-bottom: 1rem'
            : 'padding: .5rem 0'
      ">
        <sv-button
          v-if="!addVisible"
          icon="plus"
          @clicked="addVisible = true"
        >
          {{ $t('add') }}
        </sv-button>
        <sv-form
          v-else
          v-bind="{
            form: includeTitle
              ? messageStore.properties
              : messageStore.useProperties(['content']),
            formData: messageStore.item
          }"
        >
          <template #footer>
            <sv-button @clicked="pushMessage">
              {{ $t('send') }}
            </sv-button>
            <sv-button
              small
              variant="transparent"
              @clicked="addVisible = false"
            >
              {{ $t('cancel') }}
            </sv-button>
          </template>
        </sv-form>
      </div>
    </sv-box>


    <sv-box fill v-if="messages.length">
      <div
        v-if="messages.length"
        class="messages__list"
      >
        <sv-message
          v-for="message in messages"
          v-bind="message"
          :key="message._id"
          :style="noBorder && 'padding: 1rem 0'"
        ></sv-message>
      </div>
    </sv-box>
  </sv-group>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useStore } from '@savitri/web'
import { SvGroup, SvBox, SvForm, SvButton } from '../..'
import SvMessage from './_internals/components/sv-message-entry/sv-message-entry.vue'

type Props = {
  modelValue?: any
  itemInfo?: {
    identifier: string
    title: string
    description: string
  }
  includeTitle?: boolean
  noBorder?: boolean
}

const props = defineProps<Props>()
const addVisible = ref(false)

const subscriptionStore = useStore('subscription')
const messageStore = useStore('message')

const subscription = computed(() => props.modelValue || subscriptionStore.item)
const messages = computed(() => {
  const items = props.modelValue?.messages || subscriptionStore.item.messages
  return items.sort((a, b) => a.created_at > b.created_at ? -1 : 1)
})

if( props.itemInfo ) {
  subscriptionStore.setItem(props.itemInfo)
}

const itemInfo = computed(() => subscriptionStore.select([
  'title',
  'description',
  'route',
  'identifier'
]))

watch(() => props.itemInfo, (item) => {
  subscriptionStore.setItem(item)
  subscriptionStore.get({
    filters: {
      identifier: itemInfo.value.identifier
    }
  })

}, { deep: true })

const pushMessage = async () => {
  const { title, ...message } = messageStore.condensedItem
  await subscriptionStore.functions.pushMessage({
    _id: subscription.value._id,
    message,
    item: itemInfo.value
  }, { insert: true })

  messageStore.clearItem()
}
</script>

<style scoped src="./sv-messages.scss"></style>
