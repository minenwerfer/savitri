<template>
  <div
    v-clickable
    class="flex items-center gap-x-1"
    @click="visible = true"
  >
    <slot></slot>
    <sv-icon name="info-circle" class="w-5 h-5"></sv-icon>
  </div>

  <teleport to="body">
    <sv-box :float="true" v-model:visible="visible" @close="visible = false">
      <template #title>
        <slot name="title"></slot>
      </template>
      <template #body>
        <sv-prose>
          <slot name="body"></slot>
        </sv-prose>
      </template>
    </sv-box>
  </teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { SvBox, SvProse, SvIcon } from '../../'

const visible = ref(false)
</script>
