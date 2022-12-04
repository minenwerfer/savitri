<template>
  <sv-search-container v-if="selected?.length > 0">
    <sv-search-item
      v-for="item in selected"
      v-bind="{
        item,
        indexes
      }"
      :key="item._id"
    >
      <div v-if="!searchOnly" class="selected__icons">
        <sv-icon
          v-clickable
          name="edit"
          @click="edit(item)"
        ></sv-icon>
        <sv-icon
          v-clickable
          name="trash"
          @click="unselect(item)"
        ></sv-icon>
      </div>

      <div v-else class="selected__icons">
        <sv-icon
          v-clickable
          name="minus"
          @click="unselect(item, false)"
        ></sv-icon>
      </div>
    </sv-search-item>
  </sv-search-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CollectionProperty } from '../../../../../../../types'
import { SvIcon } from '../../../../..'
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

const selected = computed(() => {
  if( props.property.type === 'array' ) {
    return props.modelValue
  }

  return Object.keys(props.modelValue||{}).length > 0
    ? Array(props.modelValue)
    : []
})

const unselect = async (item: any, purge=true) => {
  if( props.property.s$purge && purge ) {
    const { _id } = item
    // await store.remove({ filter: { _id } })
  }

  const deleteFirst = () => {
    const modelValue = props.modelValue
    const idx = modelValue.findIndex((option: any) => option._id === item._id)

    modelValue.splice(idx, 1)
    return modelValue
  }

  emit('update:modelValue', props.property.type === 'array'
      ? deleteFirst()
      : undefined
  )

  if( props.property.uniqueItems ) {
    emit('pushBack', item)
  }
}
</script>
