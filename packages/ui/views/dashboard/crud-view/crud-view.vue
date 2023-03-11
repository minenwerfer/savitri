<template>
  <sv-crud
    v-if="route.params.collection"
    :collection="route.params.collection as string"
    :key="route.params.collection as string"
  ></sv-crud>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import SvCrud from '../../../components/sv-crud/sv-crud.vue'

const route = useRoute()
</script>
