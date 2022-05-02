<template>
  <div class="flex flex-col gap-y-8">
    <div
      v-for="(item, index) in unread"
      :key="`item-${index}`"
      class="flex flex-col gap-y-2 text-sm"
      >
      <strong>{{ item.title }}</strong>
      <div class="opacity-80">{{ item.content }}</div>
      <div class="opacity-60">{{ item.created_at.formatDateTime(true) }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useModule } from 'frontend/composables'


const store = useStore()
const moduleRefs = reactive(useModule('notification', store))

const unread = computed(() => store.getters['notification/unread'])

const {
  items

} = toRefs(moduleRefs)
</script>
