<template>
  <div class="flex flex-col gap-y-8">
    <div
      v-for="(item, index) in store.unread"
      :key="`item-${index}`"
      class="flex flex-col gap-y-2 text-sm"
    >
      <strong>{{ store.item.title }}</strong>
      <div class="opacity-80">{{ store.item.content }}</div>
      <div class="opacity-60">{{ store.item.created_at?.formatDateTime(true) }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '@savitri/web'
const store = useStore('notification')
</script>
