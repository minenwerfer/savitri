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
        <sv-bare-button @clicked="edit(item)">
          <sv-icon
            name="edit"
            fill="gray"
          ></sv-icon>
        </sv-bare-button>
        <sv-bare-button @clicked="unselect(item)">
          <sv-icon
            name="trash"
            fill="gray"
          ></sv-icon>
        </sv-bare-button>
      </div>

      <div v-else class="selected__icons">
        <sv-bare-button @clicked="unselect(item, false)">
          <sv-icon name="minus" fill="gray"></sv-icon>
        </sv-bare-button>
      </div>
    </sv-search-item>
  </div>
</template>

<script setup lang="ts">
import { SvBareButton, SvIcon } from '../../../../..'
import SvSearchItem from '../sv-search-item/sv-search-item.vue'

type Props = {
  selected: Array<any>
  indexes: Array<string>
  searchOnly: boolean
}

const props = defineProps<Props>()
</script>

<style scoped src="./sv-search-selected.scss"></style>
