<template>
  <div :class="`results ${resultsByModule.length === 0 && 'results--hidden'}`">
    <div class="results__modules">
      <div
        v-for="([moduleName, results], index) in resultsByModule"
        :key="`results-${moduleName}`"
        class="results__module"
        >
        <div class="results__module-name">{{ $t(moduleName).capitalize() }}</div>
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
                v-for="({ key, field, value }, iindex) in getEntries(moduleName, result)"
                :key="`info-${result._id}-${iindex}`"
                class="results__info-line"
              >
                <div class="results__info-label">{{ field.label }}</div>
                <div class="results__info-value">{{ value }}</div>
              </div>
            </div>

            <div class="results__actions">
              <div
                v-for="([actionName, action]) in getActions(moduleName)"
                :key="`action-${actionName}`"
                class="results__action"

                @click="callAction(moduleName, actionName, action, { _id: result._id })"
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
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { action } from '../../../../../../../common'
import { SvPicture, SvIcon } from '../../../../..'

const store = useStore()
const router = useRouter()

const resultsByModule = computed(() => {
  return Object.entries(store.getters['searchable/item'])
    .filter(([, results]: [unknown, Array<any>]) => results.length > 0)
})

const getEntries = (moduleName: string, result: any) => Object.entries(result)
  .filter(([key]: [string, unknown]) => !['_id', '_picture'].includes(key))
  .map(([key, value]: [string, string]) => {
    const field = store.state[moduleName]._description.fields[key]
    return {
      key,
      field,
      value
    }
  })

const getActions = (moduleName: string) =>
  Object.entries(store.state[moduleName]._description.searchable.actions||{})

const callAction = async (moduleName: string, actionName: string, props: any, filters: any) => {
  store.dispatch('searchable/clear')
  action(moduleName, store, router)(actionName, props, filters)
}
</script>

<style scoped src="./sv-search-results.scss"></style>
