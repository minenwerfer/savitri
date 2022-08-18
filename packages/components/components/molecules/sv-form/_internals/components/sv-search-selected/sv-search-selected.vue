<template>
  <div v-if="selected.length > 0" class="selected">
    <sv-search-item
      v-for="item in selected"
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
  selected: Array<any>
  indexes: Array<string>
  searchOnly: boolean
}

const props = defineProps<Props>()
</script>

<style scoped src="./sv-search-selected.scss"></style>
