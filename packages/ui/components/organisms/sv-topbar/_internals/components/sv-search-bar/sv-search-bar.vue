<template>
  <div class="searchbar">
    <sv-input
      v-model.lazy="query"
      v-bind="{
        icon: 'search',
        placeholder: 'Buscar',
        type: 'search'
      }"
      class="searchbar__input"
    ></sv-input>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, provide } from 'vue'
import { useHttp } from '@savitri/web'
import { SvInput } from '../../../../..'
import { results } from '../../store'

const { http } = useHttp()
const query = ref('')

provide('iconReactive', false)

watch(() => query.value, async () => {
  if( query.value.length === 0 ) {
    results.items = []
    return
  }

  results.items = (await http.post('_/searchable/search', {
    query: query.value
      .replace(/(\(|\))/g, '')
      .split(',')
      .map((q: string) => q.trim())
  })).data.result
})
</script>

<style scoped src="./sv-search-bar.scss"></style>
