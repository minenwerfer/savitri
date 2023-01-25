<template>
  <div class="searchbar">
    <sv-input
      v-model.lazy="query"
      variant="bold"
      :property="{
        type: 'string',
        s$placeholder: 'Buscar',
        s$icon: 'search',
        s$inputType: 'search',
        s$focus: true
      }"
      class="searchbar__input"
    ></sv-input>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, provide } from 'vue'
import { useHttp } from '../../../../../../../web'
import { SvInput } from '../../../../..'
import { results } from '../../store'

const { http } = useHttp()
const query = ref('')

provide('iconReactive', false)

const search = async () => {
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
}

watch(() => query.value, search)
</script>

<style scoped src="./sv-search-bar.scss"></style>
