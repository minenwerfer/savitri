<template>
  <div :class="`results ${resultsByModule.length === 0 && 'results--hidden'}`">
    <div class="results__collections">
      <div
        v-for="([collectionName, results], index) in resultsByModule"
        :key="`results-${collectionName}`"
        class="results__collection"
        >
        <div class="results__collection-name">{{ $t(collectionName).capitalize() }}</div>
        <div class="results__results">
          <div
            v-for="(result, rindex) in results"
            :key="`result-${result._id}`"
            class="results__result"
            >
            <div class="results__picture">
              <sv-picture :file="result._picture">
                <div class="results__picture-fallback"></div>
              </sv-picture>
            </div>
            <div class="results__info">
              <div
                v-for="({ key, field, value }, iindex) in getEntries(collectionName, result)"
                :key="`info-${result._id}-${iindex}`"
                class="results__info-line"
              >
                <div class="results__info-label">{{ field.label }}</div>
                <div class="results__info-value">{{ value }}</div>
              </div>
            </div>

            <div class="results__actions">
              <div
                v-for="([actionName, action]) in getActions(collectionName)"
                :key="`action-${actionName}`"
                class="results__action"

                @click="callAction(collectionName, actionName, action, { _id: result._id })"
              >
                <sv-icon :name="action.unicon" class="results__action-icon"></sv-icon>
                <div class="results__action-name">{{ action.name }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '@savitri/web'
import { action } from '../../../../../../../common'
import { SvPicture, SvIcon } from '../../../../..'
import { results } from '../../stores/search'

const router = useRouter()

const resultsByModule = computed(() => {
  return Object.entries(results.items)
    .filter(([, results]: [unknown, Array<any>]) => results.length > 0)
})

const getEntries = (collectionName: string, result: any) => Object.entries(result)
  .filter(([key]: [string, unknown]) => !['_id', '_picture'].includes(key))
  .map(([key, value]: [string, string]) => {
    const store = useStore(collectionName)
    const field = store.description.fields[key]
    return {
      key,
      field,
      value
    }
  })

const getActions = (collectionName: string) => {
  const store = useStore(collectionName)
  return Object.entries(store.description.searchable.actions||{})
}

const callAction = async (collectionName: string, actionName: string, props: any, filters: any) => {
  results.items = []
  // action(collectionName, store, router)(actionName, props, filters)
}
</script>

<style scoped src="./sv-search-results.scss"></style>
