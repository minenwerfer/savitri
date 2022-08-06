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
              <a
                v-for="(actionProps, index) in getActions(collectionName)"
                :key="`action-${actionProps.action}`"
                class="results__action"
                @click="callAction(collectionName, actionProps, { _id: result._id })"
              >
                <sv-icon :name="actionProps.unicon">
                  {{ actionProps.name }}
                </sv-icon>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore, useAction } from '@savitri/web'
import { SvPicture, SvIcon } from '../../../../..'
import { results } from '../../store'

const router = useRouter()
const collectionsActions = {}

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
  return store.searchableActions
}

const callAction = async (
  collectionName: string,
  actionProps: any,
  filters: any
) => {
  results.items = []
  collectionsActions[collectionName].call(actionProps)(filters)
}

watch(() => results.items, <T extends { _id: string }>(items: Record<string, T>) => {
  Object.keys(items).forEach((collectionName: string) => {
    if( !(collectionName in collectionsActions) ) {
      const store = useStore(collectionName)
      const [call, eventBus] = useAction(store, router)

      collectionsActions[collectionName] = {
        call,
        eventBus
      }
    }
  })
}, { immediate: true })
</script>

<style scoped src="./sv-search-results.scss"></style>
