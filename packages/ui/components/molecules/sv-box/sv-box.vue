<template>
  <div
    v-if="visible"
    v-overlay="{
      condition: overlay || fixedRight || isFloating,
      invisible: invisibleOverlay,
      click: overlayClick
    }"

    :class="`
      box
      ${isFloating && 'box--floating'}
      ${fixedRight && 'box--fixed'}
  `">
    <!-- box content -->
    <div
      :class="`
        box__content
        ${isFloating && 'box__content--floating'}
        ${fixedRight && 'box__content--fixed-right'}
        ${transparent && 'box__content--transparent'}
        ${transparentMobile && 'box__content--transparent-mobile'}
      `"
      @click="$event.stopPropagation()"
    >
      <!-- box head -->
      <div
        v-if="$slots.title || title"
        :class="`
          box__header
          ${isCollapsed && 'box__header--collapsed'}
      `">
        <div class="box__header-title">
          <slot v-if="$slots.title" name="title"></slot>
          <div v-else-if="title">{{ title }}</div>
        </div>

        <slot v-if="$slots.extra" name="extra"></slot>

        <sv-icon
          v-clickable
          v-if="collapsable"
          reactive
          :name="!isCollapsed ? 'minus' : 'plus'"
          @click="toggleCollapsed(!isCollapsed)"
        />
        <sv-icon
          v-clickable
          v-else-if="closeHint"
          reactive
          name="multiply"
          @click="close"
        />
      </div>

      <!-- box body -->
      <div
        v-if="!isCollapsed"
        :class="`
          box__body
          ${fill || 'box__body--padded'}
      `"
        ref="body"
        @scroll="updateScroll"
      >
        <slot v-if="$slots.default"></slot>
        <slot v-else name="body"></slot>
      </div>

      <!-- box footer -->
      <div
        v-if="$slots.footer"
        :class="`
          box__footer
          ${reachedEnd || 'box__footer--shadowed'}
        `"
      >
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, computed, ref } from 'vue'
import { SvIcon } from '../../'

// #region props
type Props = {
  closeHint?: boolean
  visible?: boolean
  animate?: boolean
  title?: string
  float?: boolean
  fixedRight?: boolean
  floating?: boolean
  overlay?: boolean
  invisibleOverlay?: boolean
  collapsed?: boolean
  collapsable?: boolean
  fullWidth?: boolean
  classes?: string
  fill?: boolean
  transparent?: boolean
  transparentMobile?: boolean
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
  (e: 'update:collapsed', value: boolean): void
  (e: 'update:closeHint', value: boolean): void
  (e: 'overlayClick'): void
  (e: 'close'): void
}>()

const isFloating = computed(() => props.floating || props.float)
const isCollapsed = ref(props.collapsed)

const body = ref(null)
const reachedEnd = ref(true)

const updateScroll = () => {
  const { value: bodyElem } = body
  reachedEnd.value = bodyElem
    ? bodyElem.scrollTop + bodyElem.offsetHeight >= bodyElem.scrollHeight
    : true
}

watch(() => body.value, (bodyElem) => {
  if( bodyElem ) {
    const ob = new ResizeObserver(updateScroll)
    ob.observe(bodyElem)
  }
})

const close = () => {
  emit('update:visible', false)
  emit('close')
}

const overlayClick = () => {
  emit('overlayClick')
}

const toggleCollapsed = (value: boolean) => {
  emit('update:collapsed', value)
  isCollapsed.value = value
}
</script>

<style scoped src="./sv-box.scss"></style>
