<template>
  <div class="dropdown">
    <sv-bare-button
      v-for="(action, aindex) in filterActions(actions)"
      :key="`action-${aindex}`"
      class="dropdown__item"
      @clicked="onClick(action, row)"
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
import { SvBareButton, SvIcon } from '../../../../..'
import { dropdownVisible } from '../../store'

type Props = {
  actions: any
  row: any
}

const props = defineProps<Props>()
const userStore = useStore('user')

const filterActions = (actions: Array<any>) => {
  return actions.filter((action: any) => {
    if( action.roles ) {
      return action.roles.include(userStore.$currentUser.access.role)
    }

    return !!action.click
  })
}

const onClick = (action, row) => {
  action.click(row)
  dropdownVisible.value = false
}
</script>

<style scoped src="./sv-dropdown-content.scss"></style>
