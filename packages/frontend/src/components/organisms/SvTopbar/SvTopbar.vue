<template>
  <sv-box classes="relative shadow-none py-0 bg-[#08217c] text-white rounded-none">
    <div class="flex justify-between h-12 md:h-14">
      <sv-breadcumb
        class="hidden md:inline-flex"
        v-if="webpackVariables.breadcumb"
      ></sv-breadcumb>

      <div
        @click="$router.push({ name: 'dashboard-home' })"
        class="md:hidden cursor-pointer"
      >
        <div v-if="!productLogoAlt">{{ productName }}</div>
        <img
          v-else
          :src="require(`@/../assets/${productLogoAlt}`).default"
          class="h-full object-contain py-2"
        />
      </div>

      <div class="flex ml-auto gap-x-4">
        <slot></slot>
        <sv-bare-button
          @clicked="$store.dispatch('meta/swapMenu')"
          class="block md:hidden"
        >
          <unicon name="bars" fill="white"></unicon>
        </sv-bare-button>
      </div>
    </div>
  </sv-box>
</template>

<script setup lang="ts">
import { defineAsyncComponent, inject } from 'vue'
import { default as webpackVariables } from 'variables'
import SvBreadcumb from './_internals/components/SvBreadcumb/SvBreadcumb.vue'

const SvBox = defineAsyncComponent(() => import('frontend/components/molecules/SvBox/SvBox.vue'))
const SvBareButton = defineAsyncComponent(() => import('frontend/components/atoms/SvBareButton/SvBareButton.vue'))

const productLogoAlt = inject('productLogoAlt')
const productName = inject('productName')
</script>

<style>
._link:not(:last-child):after {
  content: '/';
  margin: 0 .5em;
}
</style>
