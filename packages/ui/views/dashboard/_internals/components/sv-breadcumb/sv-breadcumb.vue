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
        gap: .6rem;
        font-weight: bold;
        opacity: .8;
      "
    >
      {{ viewTitle }}
    </sv-icon>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { SvIcon } from '../../../../../components'

const route = useRoute()
</script>

<style scoped src="./sv-breadcumb.scss"></style>
