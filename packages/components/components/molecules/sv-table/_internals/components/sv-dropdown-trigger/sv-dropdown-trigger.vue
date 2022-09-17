<template>
  <div class="dropdown">
    <a class="dropdown__trigger" @click="dropdownVisible = id">
      <sv-icon
        reactive
        name="setting"
        fill="gray"
        ></sv-icon>
    </a>
    <div class="dropdown__content" v-if="dropdownVisible === id">
      <div class="overlay" @click="dropdownVisible = false"></div>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { dropdownVisible } from '../../store'
import { SvIcon } from '../../../../..'

const props = defineProps<{ id: string }>()
</script>

<style scoped src="./sv-dropdown-trigger.scss"></style>
