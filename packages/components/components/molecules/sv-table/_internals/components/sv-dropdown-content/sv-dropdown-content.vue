<template>
  <div class="dropdown">
    <sv-bare-button
      v-for="(action, aindex) in filterActions(actions)"
      :key="`action-${rindex}-${aindex}`"
      class="dropdown__item"
      @clicked="action.click(row)"
    >
      <sv-icon
        :name="action.unicon"
        v-if="action.unicon"
        class="dropdown__item-icon"
        ></sv-icon>
      <div>{{ action.name }}</div>
    </sv-bare-button>
  </div>
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import {
  SvBareButton,
  SvIcon

} from '../../../../..'

interface Props {
  actions: any
  row: any
}

const props = defineProps<Props>()
const store = useStore()

const filterActions = (actions: Array<any>) => {
  return actions.filter((action: any) =>
    !action.useronly || store.getters['user/current'].access.visibility !== 'useronly'
  )
}
</script>

<style scoped src="./sv-dropdown-content.scss"></style>
