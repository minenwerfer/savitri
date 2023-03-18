<template>
  <sv-search-container v-if="selected?.length > 0">
    <sv-search-item
      v-for="item in selected"
      v-bind="{
        item,
        indexes
      }"
      :key="item._id"
      @click="unselect(item, false)"
    >
      <sv-icon v-clickable name="check-circle"></sv-icon>
    </sv-search-item>
  </sv-search-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CollectionProperty } from '@semantic-api/types'
import { useParentStore } from '@savitri/web'
import SvIcon from '../../../../../sv-icon/sv-icon.vue'
import SvSearchContainer from '../sv-search-container/sv-search-container.vue'
import SvSearchItem from '../sv-search-item/sv-search-item.vue'

type Props = {
  modelValue?: any
  indexes: Array<string>
  searchOnly?: boolean
  property: CollectionProperty
}

type Emits = {
  (e: 'update:modelValue' | 'pushBack', value: Props['modelValue']): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const property = props.property
const store = useParentStore()

const selected = computed(() => {
  if( property.type === 'array' ) {
    return props.modelValue
  }

  return Object.keys(props.modelValue||{}).length > 0
    ? Array(props.modelValue)
    : []
})

const unselect = async (item: any, purge=true) => {
  if( property.s$purge && purge ) {
    const { _id } = item
    await store.remove({ filters: { _id } })
  }

  const deleteFirst = () => {
    const modelValue = props.modelValue
    const idx = modelValue.findIndex((option: any) => option._id === item._id)

    modelValue.splice(idx, 1)
    return modelValue
  }

  emit('update:modelValue', property.type === 'array'
      ? deleteFirst()
      : null
  )

  if( property.uniqueItems || (property.type === 'array' && props.searchOnly) ) {
    emit('pushBack', item)
  }
}
</script>

<style scoped lang="scss">
:deep([data-component=icon]) {
  fill: green;
}
</style>
