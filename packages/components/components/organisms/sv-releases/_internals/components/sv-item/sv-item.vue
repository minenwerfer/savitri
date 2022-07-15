<template>
  <div class="flex flex-col gap-y-3 pb-24">
    <div v-for="(item, index) in items" class="bg-white border-l-[6px] border-purple-400 px-3 py-2 min-h-[5em] shadow rounded">
      <div class="flex flex-col gap-y-3 w-full">
        <div class="flex justify-between">
          <div class="flex gap-x-3 items-center">
            <strong>{{ item.title }}</strong>
            <span class="text-sm opacity-60">v{{ item.version }}</span>
          </div>
          <div class="text-xs opacity-60">{{ item.date }}</div>
        </div>
        <div class="whitespace-pre-wrap opacity-80" v-html="item.text"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  items: any
}

const props = defineProps<Props>()
</script>
