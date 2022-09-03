<template>
  <div
    v-if="visible"
    v-overlay="{
      condition: overlay || isFloating,
      invisible: invisibleOverlay,
      click: emit('overlayClick')
    }"

    :class="`
      box
      ${isFloating && 'box--floating'}
  `">
    <!-- box content -->
    <div
      :class="`
        box__content
        ${isFloating && 'box__content--floating'}
      `"
      @click="$event.stopPropagation()"
    >
      <!-- box head -->
      <div class="box__header" v-if="$slots.title || title">
        <div class="box__header-title">
          <slot v-if="$slots.title" name="title"></slot>
          <div v-else-if="title">{{ title }}</div>
        </div>
        <div
          v-if="closeHint || collapsable"
          class="box__header-icons"
        >
          <sv-icon
            v-clickable
            v-if="collapsable"
            reactive
            :name="!isCollapsed ? 'minus' : 'plus'"
            @click="isCollapsed = !isCollapsed"
          />
          <sv-icon
            v-clickable
            v-else-if="closeHint"
            reactive
            name="multiply"
            @click="close"
          />
        </div>
      </div>

      <!-- box body -->
      <div v-if="!isCollapsed" :class="`box__body ${fill || 'box__body--padded'}`">
        <slot v-if="$slots.default"></slot>
        <slot v-else name="body"></slot>
      </div>

      <!-- box footer -->
      <div v-if="$slots.footer" class="box__footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { SvIcon } from '../../'

// #region props
type Props = {
  closeHint?: boolean
  visible?: boolean
  animate?: boolean
  title?: string
  float?: boolean
  floating?: boolean
  overlay?: boolean
  invisibleOverlay?: boolean
  collapsed?: boolean
  collapsable?: boolean
  fullWidth?: boolean
  classes?: string
  fill?: boolean
  transparent?: boolean
}
// #endregion props

const props = withDefaults(defineProps<Props>(), {
  collapsable: false,
  closeHint: false,
  visible: true,
  animate: true
})

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'update:closeHint', value: boolean): void
  (e: 'overlayClick'): void
  (e: 'close'): void
}>()

const isFloating = computed(() => props.floating || props.float)
const isCollapsed = ref(props.collapsed)

const close = () => {
  emit('update:visible', false)
  emit('close')
}
</script>

<style scoped src="./sv-box.scss"></style>
