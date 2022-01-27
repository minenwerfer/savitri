<template>
  <div class="
    flex items-center justify-between px-4 md:px-6
    sticky inset-0
    md:grid
    md:grid-cols-menu
    h-16 z-30
    bg-white shadow
    select-none
  ">
    <div
      class="cursor-pointer box-border w-1/4"
      @click="$router.push({ name: 'dashboard-home' })"
    >
      <div class="font-semibold text-xl truncate" v-if="!productLogo">
        {{ $t(productName) }}
      </div>

      <img
        v-else
        :src="require(`@/../assets/${productLogo}`).default"
        class="cursor-pointer h-12 object-contain"
      />
    </div>

    <div class="flex gap-x-1 md:gap-x-4 items-center">
      <slot></slot>

      <sv-bare-button
        @clicked="$store.dispatch('meta/swapMenu')"
        class="block md:hidden ml-2"
      >
        <unicon name="bars" fill="black" class="w-8 h-8"></unicon>
      </sv-bare-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { SvBareButton } from 'frontend/components'

const productName = inject('productName')
const productLogo = inject('productLogo')
</script>
