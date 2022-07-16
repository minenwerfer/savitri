<template>
  <div class="dropdown">
    <div class="dropdown__trigger" @click="visible =  true">
      <sv-icon
        name="setting"
        fill="gray"
        ></sv-icon>
    </div>
    <div class="dropdown__content" v-if="visible">
      <div class="overlay" @click="visible = false"></div>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { SvIcon } from '../../../../..'

const visible = ref(false)
</script>

<style scoped src="./sv-dropdown-trigger.scss"></style>
