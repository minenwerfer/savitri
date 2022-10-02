<template>
  <!-- <sv-tabbed -->
  <!--   v-model:current-tab="currentTab" -->
  <!--   :tabs="2" -->
  <!--   :bottom-helpers="false" -->
  <!--   :titles="['Sistema local', 'Base']" -->
  <!--   :key="item.base" -->
  <!-- > -->
  <!--   <template #tab-1> -->
  <!--     <sv-item :items="item.product"></sv-item> -->
  <!--   </template> -->
  <!--   <template #tab-2> -->
  <!--     <sv-item :items="item.base"></sv-item> -->
  <!--   </template> -->
  <!-- </sv-tabbed> -->
</template>

<script setup lang="ts">
import { inject, ref } from 'vue'
import { SvTabbed } from '../..'
import { default as SvItem } from './_internals/components/sv-item/sv-item.vue'

const currentTab = ref(0)
const release = inject('release', {})
</script>
