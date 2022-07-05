<template>
  <div class="searchbar">
    <sv-input
      icon="search"
      placeholder="Buscar"
      v-model.lazy="query"
      class="searchbar__input"
    ></sv-input>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useStore } from 'vuex'
import { SvInput } from '../../../../..'

const store = useStore()
const query = ref('')

watch(() => query.value, () => {
  if( query.value.length === 0 ) {
    store.dispatch('searchable/clear')
    return
  }

  store.dispatch('searchable/search', {
    query: query.value
      .replace(/(\(|\))/g, '')
      .split(',')
      .map((q: string) => q.trim())
  })
})
</script>

<style scoped src="./sv-search-bar.scss"></style>
