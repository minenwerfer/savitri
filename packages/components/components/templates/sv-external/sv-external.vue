<template>
  <div class="external">
    <div class="external__content">
      <img
        class="external__logo"
        :src="require(`@/assets/${productLogo}`).default"
      />
      <sv-box>
        <slot></slot>
      </sv-box>
      <div class="external__version">
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

<style scoped src="./sv-external.scss"></style>
