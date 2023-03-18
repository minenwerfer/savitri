<template>
  <div class="results">
    <div class="results__collections">
      <div
        v-for="([collectionName, results]) in resultsByModule"
        :key="`results-${collectionName}`"
      >
        <h2>{{ $t(collectionName).capitalize() }}</h2>
        <div>
          <div
            v-clickable
            v-for="result in results"
            :key="`result-${result._id}`"
            class="results__result"

            @click="callAction(
              collectionName,
              getActions(collectionName)[0],
              { _id: result._id }
            )"
          >
            <div
              v-if="result._picture"
              class="results__picture"
            >
              <sv-picture :file="result._picture">
                <div class="results__picture-fallback"></div>
              </sv-picture>
            </div>
            <div class="results__info">
              <div
                v-for="({ key, property, value }, iindex) in getEntries(collectionName, result)"
                :key="`info-${result._id}-${iindex}`"
              >
                <span class="results__info-label">{{ property.description || key }}</span>
                <span>{{ value }}</span>
              </div>
            </div>

            <div class="results__actions">
              <sv-button
                v-for="actionProps in getActions(collectionName).slice(1)"
                v-bind="{
                  icon: actionProps.icon,
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
import { useStore, useAction } from '@savitri/web'
import SvPicture from '../../../../../sv-picture/sv-picture.vue'
import SvButton from '../../../../../sv-button/sv-button.vue'

import { results } from '../../store'

type Emits = {
  (e: 'actionClick'): void
}

const emit = defineEmits<Emits>()
const router = useRouter()
const collectionsActions: Record<string, {
  call: any
  eventBus: any
}> = {}

const resultsByModule = computed(() => {
  return Object.entries(results.items)
    .filter(([, results]: [unknown, Array<{ _id: string }>]) => results.length > 0)
})

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
  emit('actionClick')
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
