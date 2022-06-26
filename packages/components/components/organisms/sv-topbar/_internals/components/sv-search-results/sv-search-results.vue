<template>
  <sv-overlay class="z-20" v-if="resultsByModule.length > 0"></sv-overlay>
  <sv-box class="results__box">
    <div class="results">
      <div
        v-for="([moduleName, results], index) in resultsByModule"
        :key="`results-${moduleName}`"
        class="results__module"
      >
        <div class="results__module-name">{{ $t(moduleName) }}</div>
        <div>
          <div
            v-for="(result, rindex) in results"
            :key="`result-${result._id}`"
          >
            {{ result }}
          </div>
        </div>
      </div>
    </div>
  </sv-box>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { SvBox, SvOverlay } from '../../../../..'

const store = useStore()

const resultsByModule = computed(() => {
  return Object.entries(store.getters['searchable/item'])
    .filter(([, results]: [unknown, Array<any>]) => results.length > 0)
})
</script>

<style scoped src="./sv-search-results.scss"></style>
