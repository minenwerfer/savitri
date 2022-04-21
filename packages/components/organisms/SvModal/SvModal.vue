<template>
  <sv-box :float="true" :close-hint="true" @close="$store.dispatch('meta/closeModal')" classes="lg:w-1/3 xl:w-1/3">
    <template #title>
      <slot name="title"></slot>
    </template>
    <template #body>
      <div class="opacity-60 whitespace-pre-wrap">
        <slot name="body"></slot>
      </div>
    </template>
    <template #footer v-if="$slots.footer">
      <slot name="footer"></slot>
    </template>
  </sv-box>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const SvBox = defineAsyncComponent(() => import('components/molecules/SvBox/SvBox.vue'))
</script>
