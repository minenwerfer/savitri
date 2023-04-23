<template>
  <div class="
    no-print
    breadcumb
  ">
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
import SvIcon from '../../../../../components/sv-icon/sv-icon.vue'
</script>

<style scoped src="./sv-breadcumb.scss"></style>
