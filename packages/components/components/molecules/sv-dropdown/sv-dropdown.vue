<template>
  <div class="dropdown">
    <a
      class="dropdown__trigger"
      @click="dropdownVisible = true"
    >
      <slot></slot>
    </a>
    <div
      v-if="dropdownVisible"
      v-overlay.invisible="{
        click: () => {
          dropdownVisible = false
        }
      }"
      class="dropdown__content"
    >
      <slot v-if="$slots.extra" name="extra"></slot>

      <div>
        <sv-bare-button
          v-for="(action, aindex) in filterActions(actions)"
          :key="`action-${aindex}`"
          class="dropdown__item"
          @clicked="onClick(action, subject)"
        >
          <sv-icon
            small
            v-if="action.unicon"
            :name="action.unicon"
          >
            {{ action.name }}
          </sv-icon>
        </sv-bare-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from '@savitri/web'
import { SvBareButton, SvIcon } from '../..'

type Props = {
  actions?: any
  subject?: any
}

const props = defineProps<Props>()
const userStore = useStore('user')

const dropdownVisible = ref(false)

const filterActions = (actions: Array<any>) => {
  return actions.filter((action: any) => {
    if( action.roles ) {
      return action.roles.include(userStore.$currentUser.role)
    }

    return !!action.click
  })
}

const onClick = (action, subject) => {
  action.click(subject)
  dropdownVisible.value = false
}
</script>

<style scoped src="./sv-dropdown.scss"></style>
