<template>
  <div class="relative bg-white text-gray-600 border-b px-4">
    <div class="flex justify-end md:justify-between h-[3.2rem]">
      <sv-breadcumb
        class="hidden md:inline-flex"
      ></sv-breadcumb>

      <div
        @click="$router.push({ name: 'dashboard-home' })"
        class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer inline-flex"
      >
        <div v-if="!productLogo">{{ productName }}</div>
        <img
          v-else
          :src="require(`@/../assets/${productLogo}`).default"
          class="h-10 w-24 object-contain"
        />
      </div>

      <div class="flex gap-x-2 md:gap-x-4">
        <slot></slot>
        <sv-bare-button
          @clicked="$store.dispatch('meta/swapMenu')"
          class="block md:hidden"
        >
          <sv-icon name="bars" fill="gray"></sv-icon>
        </sv-bare-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, inject } from 'vue'
import { default as webpackVariables } from 'variables'
import { SvIcon } from 'components'
import SvBreadcumb from './_internals/components/sv-breadcumb/sv-breadcumb.vue'
const SvBareButton = defineAsyncComponent(() => import('components/atoms/sv-bare-button/sv-bare-button.vue'))

const productLogo = inject('productLogo')
const productName = inject('productName')
</script>

<style>
._link:not(:last-child):after {
  content: '/';
  margin: 0 .5em;
}
</style>
