<template>
  <c-crud :module="$route.params.module">
  </c-crud>
</template>

<script setup lang="ts">
import CCrud from 'frontend/components/templates/CCrud/CCrud.vue'
</script>
