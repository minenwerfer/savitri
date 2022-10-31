<template>
  <div class="bubbles">
    <div
      v-clickable
      v-for="filter in printableFilters"
      :key="`filter-${key}`"
      class="bubble"
      @click="removeFilter(filter.key)"
    >
      <div class="bubble__name">{{ filter.label }}</div>
      <div>{{ filter.formatted }}</div>

      <sv-icon small name="times"></sv-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useParentStore } from '../../../../../../../web'
import { SvIcon } from '../../../../../..'

const store = useParentStore()
const printableFilters = computed(() => {
  let isMongoOperation
  const activeFilters = (() => {
    const [firstEntry] = Object.entries(store.activeFilters)
    if( firstEntry && ['$and', '$or'].includes(firstEntry[0]) ) {
      isMongoOperation = true
      return firstEntry[1].reduce((a, filter) => {
        return {
          ...a,
          ...filter
        }
      }, {})
    }

    return store.activeFilters
  })()

  return Object.entries(activeFilters).map(([key, filter]) => {
    const field = store.description.fields[key]
    const formatted = (() => {
      if( field.isReference ) {
        const value = filter
        return value.slice(-8)
      }

      const value = String(filter.$regex || filter)
      return field.translate
        ? I18N.global.tc(value)
        : value
    })()

    const actualKey = isMongoOperation
      ? Object.keys(store.activeFilters)[0]
      : key

    return {
      label: field.label,
      key: actualKey,
      formatted
    }
  })
})

const removeFilter = (target: string) => {
  console.log(target)
  store.filters = Object.entries(store.filters).reduce((a: any, [key, filter]) => {
    if( key === target ) {
      return a
    }

    return {
      ...a,
      [key]: filter
    }
  }, store.freshFilters)

  store.filter()
}
</script>

<style scoped src="./sv-filter-bubbles.scss"></style>
