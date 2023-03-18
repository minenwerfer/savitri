<template>
  <div
    v-if="actions.length > 0"
    ref="contextmenu"
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
          class="contextmenu__section"
        >
          <div class="contextmenu__item">
            <slot
              v-if="$slots.extra"
              name="extra"
            ></slot>
          </div>
        </div>
        <div class="contextmenu__section">
          <sv-bare-button
            v-for="(action, aindex) in filterActions(actions)"
            :key="`action-${aindex}`"
            class="
              contextmenu__item
              contextmenu__item--reactive
            "
            @click="onClick(action, subject)"
          >
            <sv-icon
              small
              v-if="action.icon"
              :name="action.icon"
            >
              {{
                action.translate
                  ? $t(action.name)
                  : action.name
              }}
            </sv-icon>
          </sv-bare-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from '@savitri/web'
import SvBareButton from '../sv-bare-button/sv-bare-button.vue'
import SvIcon from '../sv-icon/sv-icon.vue'

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
const contextmenu = ref<HTMLDivElement|null>(null)
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

const position = computed(() => ({
  _: contextmenuVisible.value,
  x: Math.floor(contextmenu.value?.getBoundingClientRect().left||0 - window.scrollX) + 'px',
  y: Math.floor(contextmenu.value?.getBoundingClientRect().top||0 - window.scrollY) + 'px',
}))
</script>

<style scoped src="./sv-context-menu.scss"></style>

<style scoped lang="scss">
.contextmenu__content {
  transform:
    translateX(min(v-bind('position.x'), calc(100vw - 100%)))
    translateY(min(v-bind('position.y'), calc(100vh - 100%))) !important;
}
</style>
