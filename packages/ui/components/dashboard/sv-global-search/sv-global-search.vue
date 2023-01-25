<template>
  <sv-box
    overlay
    class="global-container"
    @overlay-click="emit('close')"
  >
    <div class="global">
      <sv-search-bar></sv-search-bar>
      <sv-search-results
        class="global__results"
        @action-click="emit('close')"
      ></sv-search-results>
    </div>
  </sv-box>
</template>

<script setup lang="ts">
import { SvBox } from '../../..'
import SvSearchBar from './_internals/components/sv-search-bar/sv-search-bar.vue'
import SvSearchResults from './_internals/components/sv-search-results/sv-search-results.vue'

type Emits = {
  (e: 'close'): void
}

const emit = defineEmits<Emits>()
</script>

<style scoped src="./sv-global-search.scss"></style>
