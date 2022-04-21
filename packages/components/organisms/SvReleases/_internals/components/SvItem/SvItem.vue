<template>
  <div class="flex flex-col gap-y-3 pb-24">
    <sv-panel v-for="(item, index) in props.items" :key="`item-${index}`">
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
    </sv-panel>
  </div>
</template>

<script setup lang="ts">
import { SvPanel } from 'components'

const props = defineProps<{
  items: any
}>()
</script>
