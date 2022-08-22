<template>
  <div v-if="modelValue?.length > 0" class="selected">
    <sv-search-item
      v-for="item in modelValue"
      v-bind="{
        item,
        indexes
      }"
      :key="item._id"
      class="item"
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
  </div>
</template>

<script setup lang="ts">
import { SvIcon } from '../../../../..'
import SvSearchItem from '../sv-search-item/sv-search-item.vue'

type Props = {
  modelValue: Array<any>
  indexes: Array<string>
  searchOnly: boolean
  field: any
  array: boolean
}

type Emits = {
  (e: 'update:modelValue', value: typeof Props['modelValue']): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const unselect = async (item: any, purge=true) => {
  if( props.field.purge && purge ) {
    const { _id } = item
    await store.remove({ filter: { _id } })
  }

  emit('update:modelValue', props.array
      ? props.modelValue.filter((option: any) => option._id !== item._id)
      : undefined
  )
}

</script>

<style scoped src="./sv-search-selected.scss"></style>
