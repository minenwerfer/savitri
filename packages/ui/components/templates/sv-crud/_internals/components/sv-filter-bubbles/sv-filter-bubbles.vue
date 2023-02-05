<template>
  <div class="bubbles">
    <div
      v-clickable
      v-for="filter in printableFilters"
      :key="`filter-${filter.key}`"
      class="bubble"
      @click="removeFilter(filter.key)"
    >
      <div class="bubble__name">{{ filter.description || filter.key }}</div>
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
  $lte?: string
  $gte?: string
}

const store = useParentStore()

const printableFilters = computed(() => {
  let isMongoOperation: boolean
  store.filters;

  const activeFilters = (() => {
    const [firstEntry] = Object.entries(store.activeFilters) as Array<any>

    if( firstEntry && ['$and', '$or'].includes(firstEntry[0]) ) {
      isMongoOperation = true
      return firstEntry[1].reduce((a: Record<string, any>, filter: any) => {
        return {
          ...a,
          ...filter
        }
      }, {})
    }

    return store.activeFilters
  })()

  return Object.entries(activeFilters).reduce((a: Array<{
    description: string,
    key: string,
    formatted: string
  }>, [key, filter]) => {
    const property = store.description.properties[key]
    const formatted = (() => {
      if( !property ) {
        return null
      }

      if( property.s$isReference ) {
        if( property.type === 'array' ) {
          return store.formatValue({
            value: filter,
            key,
            property
          })
        }
      }

      if( ['date', 'date-time'].includes(property.format) ) {
        const formatDate = (date?: Date|string) => {
          return date instanceof Date
            ? date.formatToString()
            : date && date.formatDateTime()
        }

        const d1 = formatDate((filter as DateFilter).$gte) || ''
        const d2 = formatDate((filter as DateFilter).$lte) || ''
        return `${d1} - ${d2}`
      }

      return store.formatValue({
        value: filter,
        key,
        property
      })
    })()

    if( !formatted ) {
      return a
    }

    const actualKey = isMongoOperation
      ? Object.keys(store.activeFilters)[0]
      : key

    return [
      ...a,
      {
        description: property?.description || key,
        key: actualKey,
        formatted
      }
    ]
  }, [])
})

const removeFilter = (target: string) => {
  store.filters = Object.entries(store.filters).reduce((a, [key, filter]) => {
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
