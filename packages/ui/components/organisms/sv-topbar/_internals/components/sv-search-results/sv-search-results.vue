<template>
  <div
    v-overlay.invisible="{
      click: clearResults
    }"
    v-if="resultsByModule.length > 0"
    class="results"
  >
    <div class="results__collections">
      <div
        v-for="([collectionName, results]) in resultsByModule"
        :key="`results-${collectionName}`"
        class="results__collection"
        >
        <div class="results__collection-name">{{ $t(collectionName).capitalize() }}</div>
        <div class="results__results">
          <div
            v-for="result in results"
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
                v-for="({ key, property, value }, iindex) in getEntries(collectionName, result)"
                :key="`info-${result._id}-${iindex}`"
                class="results__info-line"
              >
                <div class="results__info-label">{{ property.description }}</div>
                <div class="results__info-value">{{ value }}</div>
              </div>
            </div>

            <div class="results__actions">
              <sv-button
                v-for="actionProps in getActions(collectionName)"
                v-bind="{
                  icon: actionProps.unicon,
                  size: 'small',
                  variant: 'alt'
                }"

                :key="`action-${actionProps.action}`"
                @click="callAction(collectionName, actionProps, { _id: result._id })"
              >
                {{ actionProps.name }}
              </sv-button>
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
import { useStore } from '../../../../../../../web'
import { useAction } from '../../../../../../composables'

import { SvPicture, SvButton } from '../../../../..'
import { results } from '../../store'

const router = useRouter()
const collectionsActions: Record<string, {
  call: any
  eventBus: any
}> = {}

const resultsByModule = computed(() => {
  return Object.entries(results.items)
    .filter(([, results]: [unknown, Array<{ _id: string }>]) => results.length > 0)
})

const clearResults = () => {
  results.items = []
}

const getEntries = (collectionName: string, result: any) => Object.entries(result)
  .reduce((a: Array<any>, [key, value]) => {
    if( ['_id', '_picture'].includes(key) ) {
      return a
    }

    const store = useStore(collectionName)
    const property = store.description.properties[key]
    return [
      ...a,
      {
        key,
        property,
        value
      }
    ]
  }, [])

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

watch(() => results.items, (items) => {
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
