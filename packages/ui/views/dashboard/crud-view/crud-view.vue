<script setup lang="ts">
import SvCrud from '../../../components/sv-crud/sv-crud.vue'
</script>

<template>
  <div class="crud-view">
    <sv-crud
      v-if="$route.params.collection"
      :collection="$route.params.collection as string"
      :key="$route.params.collection as string"
    ></sv-crud>
  </div>
</template>

<style scoped src="./crud-view.scss"></style>
