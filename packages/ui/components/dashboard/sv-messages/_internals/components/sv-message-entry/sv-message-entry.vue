<template>
  <div class="message">
    <div class="message__user">
      <sv-user-picture
        :user="owner"
        class="message__picture"
      ></sv-user-picture>
      <strong>{{ owner.full_name }}</strong>
    </div>

    <div class="message__body">
      <div class="message__metadata">
        <sv-icon small name="calendar-alt">{{ new Date(created_at).getRelativeTimeFromNow() }}</sv-icon>
      </div>
      <p class="message__content">
        {{ content }}
      </p>

      <div class="message__bottom">
        <div
          v-clickable
          v-if="owner._id === userStore.$currentUser._id"
          @click="subscriptionStore.functions.pullMessage({ _id }, { insert: true })"
        >
          {{ $t('remove') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '@semantic-api/system'
import { useStore } from '@savitri/web'
import { SvIcon, SvUserPicture } from '../../../../../..'

type Props = {
  _id: string
  owner: User
  content: string
  created_at: string
}

const props = defineProps<Props>()
const subscriptionStore = useStore('subscription')
const userStore = useStore('user')
</script>

<style scoped src="./sv-message-entry.scss"></style>
