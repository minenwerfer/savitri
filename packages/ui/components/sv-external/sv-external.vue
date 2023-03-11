<template>
  <div class="external">
    <div class="external__wrapper">
      <sv-branding
        v-clickable
        click="homepage"
        class="external__logo"
      ></sv-branding>
      <sv-box>
        <div class="external__content">
          <!-- <slot v-if="$slots.default"></slot> -->
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
import { SvBox, SvBranding } from '..'

// const productName = inject('productName')
// const productLogo = inject('productLogo')
//const productVersion = inject('productVersion')
//const baseVersion = inject('baseVersion')
</script>

<style scoped src="./sv-external.scss"></style>
