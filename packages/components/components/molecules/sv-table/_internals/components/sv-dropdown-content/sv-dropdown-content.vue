<template>
  <div class="dropdown">
    <sv-bare-button
      v-for="(action, aindex) in filterActions(actions)"
      :key="`action-${aindex}`"
      class="dropdown__item"
      @clicked="action.click(row)"
    >
      <sv-icon
        :name="action.unicon"
        v-if="action.unicon"
      >
        {{ action.name }}
      </sv-icon>
    </sv-bare-button>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '@savitri/web'
import {
  SvBareButton,
  SvIcon

} from '../../../../..'

type Action = {
  name: string 
  unicon: string 
  useronly?: boolean
  click: (data: Record<string, any>) => void
}

type Props = {
  actions: Array<Action>
  row: Record<string, any>
}

const props = defineProps<Props>()
const userStore = useStore('user')

const filterActions = (actions: Array<Action>) => {
  return actions.filter((action) =>
    !action.useronly || userStore.current?.access?.visibility !== 'useronly'
  )
}
</script>

<style scoped src="./sv-dropdown-content.scss"></style>
