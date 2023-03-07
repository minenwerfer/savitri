<template>
  <div
    v-if="actions.length > 0"
    class="contextmenu"
  >
    <a
      class="contextmenu__trigger"
      @click="contextmenuVisible = true"
    >
      <slot></slot>
    </a>
    <div
      v-if="contextmenuVisible"
      v-overlay.invisible="{
        click: () => {
          contextmenuVisible = false
        }
      }"

      class="contextmenu__content"
    >

      <div>
        <div
          v-if="$slots.extra"
          class="contextmenu__item"
        >
          <slot
            v-if="$slots.extra"
            name="extra"
          ></slot>
        </div>
        <sv-bare-button
          v-for="(action, aindex) in filterActions(actions)"
          :key="`action-${aindex}`"
          class="
            contextmenu__item
            contextmenu__item--reactive
          "
          @clicked="onClick(action, subject)"
        >
          <sv-icon
            small
            v-if="action.icon"
            :name="action.icon"
            style="gap: .8rem"
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
import { useStore } from '../../../../web'
import { SvBareButton, SvIcon } from '../..'

type Props = {
  actions?: any
  subject?: any
}

type Action = {
  click: (subject: any) => void
}

type Emits = {
  (e: 'actionClicked', event: { action: Action, subject: any }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const userStore = useStore('user')
const contextmenuVisible = ref(false)

const filterActions = (actions: Array<any>) => {
  return actions.filter((action: any) => {
    if( action.roles ) {
      return action.roles.include(userStore.$currentUser.role)
    }

    return !!action.click
  })
}

const onClick = (action: Action, subject: any) => {
  action.click(subject)
  emit('actionClicked', { action, subject })

  contextmenuVisible.value = false
}
</script>

<style scoped src="./sv-context-menu.scss"></style>
