<template>
  <sv-crud
    :module="$route.params.module"
    :key="$route.params.module"
  ></sv-crud>
</template>

<script setup lang="ts">
import SvCrud from '../../../templates/sv-crud/sv-crud.vue'
</script>
