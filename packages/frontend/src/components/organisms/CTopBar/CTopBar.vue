<template>
  <div class="
    flex items-center
    sticky
    inset-0
    md:grid
    md:grid-cols-menu
    h-16 z-30
    text-white
    bg-blue-600
    select-none
  ">
    <div
      class="flex cursor-pointer font-semibold text-xl px-auto box-border truncate"
      @click="$router.push({ name: 'dashboard-home' })"
    >
      {{ $t(productName) }}
    </div>

    <c-bare-button
      @clicked="$store.dispatch('meta/swapMenu')"
      class="block md:hidden"
    >
      Menu
    </c-bare-button>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { CBareButton } from 'frontend/components'

const productName = inject('productName')
</script>
