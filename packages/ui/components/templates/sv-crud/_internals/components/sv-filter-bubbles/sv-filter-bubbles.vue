<template>
  <div class="bubbles">
    <div
      v-clickable
      v-for="filter in printableFilters"
      :key="`filter-${filter.key}`"
      class="bubble"
      @click="removeFilter(filter.key)"
    >
      <div class="bubble__name">{{ filter.description }}</div>
      <div>{{ filter.formatted }}</div>

      <sv-icon small name="times"></sv-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useParentStore } from '../../../../../../../web'
import { SvIcon } from '../../../../../..'

type DateFilter = {
  $lte: string
  $gte: string
}

const store = useParentStore()
const printableFilters = computed(() => {
  let isMongoOperation: boolean

  const activeFilters = (() => {
    const [firstEntry] = Object.entries(store.activeFilters) as Array<any>

    if( firstEntry && ['$and', '$or'].includes(firstEntry[0]) ) {
      isMongoOperation = true
      return firstEntry[1].reduce((a: any, filter: any) => {
        return {
          ...a,
          ...filter
        }
      }, {})
    }

    return store.activeFilters
  })()

  return Object.entries(activeFilters).map(([key, filter]) => {
    const property = store.description.properties[key]
    const formatted = (() => {
      if( property.s$isReference ) {
        if( property.type === 'array' ) {
          return store.formatValue({
            value: filter,
            key,
            property
          })
        }

        const value = filter as any[]
        return value.slice(-8)
      }

      if( ['date', 'date-time'].includes(property.format) ) {
        const d1 = (filter as DateFilter).$gte.split('T')[0] || ''
        const d2 = (filter as DateFilter).$lte?.split('T')[0] || ''
        return `${d1} - ${d2}`
      }

      return store.formatValue({
        value: filter,
        key,
        property
      })
    })()

    const actualKey = isMongoOperation
      ? Object.keys(store.activeFilters)[0]
      : key

    return {
      description: property.description,
      key: actualKey,
      formatted
    }
  })
})

const removeFilter = (target: string) => {
  store.filters = Object.entries(store.filters).reduce((a: any, [key, filter]) => {
    if( key === target ) {
      return a
    }

    return {
      ...a,
      [key]: filter
    }
  }, Object.assign({}, store.freshFilters))

  store.filter()
}
</script>

<style scoped src="./sv-filter-bubbles.scss"></style>
