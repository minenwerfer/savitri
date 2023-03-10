<template>
  <div class="
    no-print
    breadcumb
  ">
    <sv-icon
      v-clickable
      small
      name="arrow-left"
      class="breadcumb__back"
      @click="$router.back"
    ></sv-icon>
    <sv-icon
      small
      :name="viewIcon"
      style="
        display: flex;
        gap: .4rem;
        font-weight: 500;
      "
    >
      {{ viewTitle }}
    </sv-icon>
  </div>
</template>

<script setup lang="ts">
import { SvIcon } from '../../../../../components'
</script>

<style scoped src="./sv-breadcumb.scss"></style>
