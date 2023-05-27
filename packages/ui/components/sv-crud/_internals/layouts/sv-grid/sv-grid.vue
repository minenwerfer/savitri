<script setup lang="ts">
import { LayoutOptions } from '@semantic-api/types'
import { useParentStore } from '@savitri/web'

import SvContextMenu from '../../../../sv-context-menu/sv-context-menu.vue'
import SvIcon from '../../../../sv-icon/sv-icon.vue'
import SvPicture from '../../../../sv-picture/sv-picture.vue'

type Props = {
  individualActions: any
  hasSelectionActions: boolean
  layoutOptions: LayoutOptions
}

const props = defineProps<Props>()
const layoutOptions = props.layoutOptions

const store = useParentStore()

const firstIfArray = (what: any) => {
  return Array.isArray(what)
    ? what[0]
    : what
}
</script>

<template>
  <div class="grid">
    <div
      v-for="item in store.items"
      :key="item"
      class="grid__item"
    >
      <sv-picture
        :url="firstIfArray(item[layoutOptions.picture!])?.link"
        class="grid__picture"
      ></sv-picture>
      <div class="grid__footer">
        <div>
          {{ item[layoutOptions.title!] }}
        </div>
        <sv-context-menu
          v-if="individualActions.length > 0"
          v-bind="{
            subject: item,
            actions: individualActions
        }">
          <sv-icon
            v-clickable
            reactive
            small
            name="ellipsis-v"
            ></sv-icon>
        </sv-context-menu>
      </div>
    </div>
  </div>
</template>

<style scoped src="./sv-grid.scss"></style>
