<script setup lang="ts">
import { LayoutOptions } from '@semantic-api/types'
import { useParentStore } from '@savitri/web'

import SvContextMenu from '../../../../sv-context-menu/sv-context-menu.vue'
import SvIcon from '../../../../sv-icon/sv-icon.vue'
import SvCard from '../../../../sv-card/sv-card.vue'
import SvGrid from '../../../../sv-grid/sv-grid.vue'
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
  <sv-grid>
    <sv-card
      v-for="item in store.items"
      :key="item"
    >
      <sv-picture
        expandable
        :url="firstIfArray(item[layoutOptions.picture])?.link"
        :meta="firstIfArray(item[layoutOptions.picture])"
      ></sv-picture>

      <template #footer>
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
            name="ellipsis-h"
            ></sv-icon>
        </sv-context-menu>
      </template>
    </sv-card>

  </sv-grid>
</template>
