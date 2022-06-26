<template>
  <sv-input
    icon="search"
    placeholder="Buscar"
    v-model.lazy="query"
  ></sv-input>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useStore } from 'vuex'
import { SvInput } from '../../../../..'

const store = useStore()
const query = ref('')

watch(() => query.value, () => {
  if( query.value.length > 0 ) {
    store.dispatch('searchable/search', {
      query: query.value.split(',').map((q: string) => q.trim())
    })
    return
  }

  store.dispatch('searchable/clear')
})
</script>
