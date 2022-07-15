<template>
  <div v-if="visible" :class="`box ${isFloating && 'box--floating'}`">
    <sv-overlay v-if="isFloating"></sv-overlay>

    <!-- box content -->
    <div
      @click="$event.stopPropagation()"
      :class="`box__content ${isFloating && 'box__content--floating'}`"
    >
      <!-- box head -->
      <div class="box__header" v-if="$slots.title || title">
        <div class="box__header-title">
          <slot v-if="$slots.title" name="title"></slot>
          <div v-else-if="title">{{ title }}</div>
        </div>
        <div class="box__header-icons" v-if="closeHint || collapsable">
          <sv-bare-button
            v-if="collapsable"
            @click="isCollapsed = !isCollapsed"
          >
            <sv-icon
              :name="!isCollapsed ? 'minus' : 'plus'"
              :reactive="true"
            />
          </sv-bare-button>
          <sv-bare-button
            v-else-if="closeHint"
            @click="$emit('close')"
          >
            <sv-icon
              name="multiply"
              :reactive="true"
            />
          </sv-bare-button>
        </div>
      </div>

      <!-- box body -->
      <div :class="`box__body ${fill || 'box__body--padded'}`">
        <slot v-if="$slots.default"></slot>
        <slot v-else name="body"></slot>
      </div>

      <!-- box footer -->
      <div class="box__footer" v-if="$slots.footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  SvBareButton,
  SvOverlay,
  SvIcon

} from '../../'

interface Props {
  closeHint?: boolean
  visible?: boolean
  animate?: boolean
  title?: string
  float?: boolean
  floating?: boolean
  collapsed?: boolean
  collapsable?: boolean
  fullWidth?: boolean
  classes?: string
  fill?: boolean
  transparent?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  closeHint: true,
  visible: true,
  animate: true
})

const isFloating = computed(() => props.floating || props.float)
const isCollapsed = ref(props.collapsed)
</script>

<style scoped src="./sv-box.scss"></style>
