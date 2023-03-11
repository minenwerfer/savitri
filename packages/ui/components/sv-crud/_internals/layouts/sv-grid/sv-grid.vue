<template>
  <div class="grid">
    <div
      v-for="item in store.items"
      :key="item"
      class="grid__item"
    >
      <sv-picture
        :url="firstIfArray(item[layoutOptions.picture!])?.link"
        style="height: 80%"
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
            name="ellipsis-h"
            ></sv-icon>
        </sv-context-menu>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LayoutOptions } from '@semantic-api/types'
import { useParentStore } from '../../../../../../web'
import {
  SvContextMenu,
  SvIcon,
  SvPicture

} from '../../../..'

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

<style scoped src="./sv-grid.scss"></style>
