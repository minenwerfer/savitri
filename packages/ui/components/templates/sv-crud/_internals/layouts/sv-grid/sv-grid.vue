<template>
  <div class="grid">
    <sv-box
      fill
      v-for="item in store.items"
      :key="item"
      class="grid__item"
    >
      <sv-picture
        :url="firstIfArray(item[layoutOptions.picture!])?.link"
        style="height: 100%"
      ></sv-picture>
      <template #footer>
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
              name="setting"
              ></sv-icon>
          </sv-context-menu>
        </div>
      </template>
    </sv-box>
  </div>
</template>

<script setup lang="ts">
import { LayoutOptions } from '@semantic-api/types'
import { useParentStore } from '../../../../../../../web'
import {
  SvBox,
  SvContextMenu,
  SvIcon,
  SvPicture

} from '../../../../..'

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
