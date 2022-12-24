<template>
  <div class="grid">
    <sv-box
      fill
      v-for="item in store.items"
      :key="item"
      class="grid__item"
    >
      <sv-picture
        :url="firstIfArray(item[layoutOptions.picture!]).link"
        style="height: 16rem"
      ></sv-picture>
      <template #footer>
        <div class="grid__footer">
          <div>
            {{ item[layoutOptions.title!] }}
          </div>
          <sv-dropdown
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
          </sv-dropdown>
        </div>
      </template>
    </sv-box>
  </div>
</template>

<script setup lang="ts">
import { useParentStore } from '@savitri/web'
import { LayoutOptions } from '../../../../../../../types'
import {
  SvBox,
  SvDropdown,
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
