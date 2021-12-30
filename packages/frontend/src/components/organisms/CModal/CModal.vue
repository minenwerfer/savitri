<template>
  <c-box :float="true" :close-hint="true" @close="$store.dispatch('meta/closeModal')">
    <template #title>
      <slot name="title"></slot>
    </template>
    <template #body>
      <div class="opacity-60">
        <slot name="body"></slot>
      </div>
    </template>
    <template #footer v-if="$slots.footer">
      <slot name="footer"></slot>
    </template>
  </c-box>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const CBox = defineAsyncComponent(() => import('frontend/components/molecules/CBox/CBox.vue'))
</script>
