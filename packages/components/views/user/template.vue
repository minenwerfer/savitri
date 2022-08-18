<template>
  <div class="template">
    <div class="template__content">
      <img
        class="template__logo"
        :src="require(`@/assets/${productLogo}`).default"
      />
      <sv-box>
        <router-view class="template__view"></router-view>
      </sv-box>
      <div class="template__version">
        v{{ productVersion }} running on Savitri v{{baseVersion}}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { provide, inject } from 'vue'
import { SvBox } from '@savitri/components'

provide('storeId', 'user')
provide('buttonVariant', 'big')

const productName = inject('productName')
const productLogo = inject('productLogo')
const productVersion = inject('productVersion')
const baseVersion = inject('baseVersion')
</script>

<style scoped src="./template.scss"></style>
