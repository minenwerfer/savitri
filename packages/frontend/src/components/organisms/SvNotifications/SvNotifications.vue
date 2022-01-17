<template>
  <sv-dropdown ref="dropdown">
    <template #trigger>
      <div class="relative pl-2 select-none">
        <unicon name="bell" fill="black" class="w-6 h-6"></unicon>
        <div
          class="absolute bottom-0 left-0 bg-red-500 border border-red-900 text-white w-5 h-5 text-center text-sm rounded-full"
          v-if="unread.length > 0"
          >{{ unread.length }}</div>
      </div>
    </template>
    <template #content>
      <teleport to="body">
        <div class="absolute inset-0 bg-gray-600 opacity-40 z-40" @click="dropdown.visible = false"></div>
        <sv-box class="absolute top-4 right-6 shadow-xl w-90 z-50">
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
        </sv-box>
      </teleport>
    </template>
  </sv-dropdown>
</template>

<script setup lang="ts">
import { reactive, toRefs, computed, ref } from 'vue'
import { useStore } from 'vuex'
import useModule from 'frontend/composables/module'
import { SvBox, SvDropdown } from 'frontend/components'

const dropdown = ref(null)

const store = useStore()
const moduleRefs = reactive(useModule('notification', store))

const unread = computed(() => store.getters['notification/unread'])

const {
  items

} = toRefs(moduleRefs)
</script>
