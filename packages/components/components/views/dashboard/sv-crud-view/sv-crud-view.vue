<template>
  <sv-crud
    :collection="collection"
    :key="collection"
  ></sv-crud>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useStore } from '@savitri/web'
import SvCrud from '../../../templates/sv-crud/sv-crud.vue'

const { params: { collection } } = useRoute()
const metaStore = useStore('meta')
metaStore.view.title = collection
</script>
