<template>
  <div class="external">
    <div class="external__wrapper">
      <img
        :src="require(`@/assets/${productLogo}`).default"
        class="external__logo"
        data-image="logo"
      />
      <sv-box>
        <div class="external__content">
          <slot></slot>
          <router-view></router-view>
        </div>
      </sv-box>
      <!-- <div class="external__version"> -->
      <!--   v{{ productVersion }} running on Savitri v{{baseVersion}} -->
      <!-- </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { provide, inject } from 'vue'
import { SvBox } from '../..'

provide('storeId', 'user')
provide('buttonSize', 'large')

// const productName = inject('productName')
const productLogo = inject('productLogo')
//const productVersion = inject('productVersion')
//const baseVersion = inject('baseVersion')
</script>

<style scoped src="./sv-external.scss"></style>
