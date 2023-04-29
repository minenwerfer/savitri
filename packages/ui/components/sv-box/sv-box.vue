<script setup lang="ts">
import { watch, computed, ref } from 'vue'
import SvIcon from '../sv-icon/sv-icon.vue'

// #region props
type Props = {
  closeHint?: boolean
  visible?: boolean|string
  title?: string
  float?: boolean
  fixedRight?: boolean
  floating?: boolean
  overlay?: boolean
  invisibleOverlay?: boolean
  collapsed?: boolean
  collapsable?: boolean
  fullWidth?: boolean
  fill?: boolean
  transparent?: boolean
  transparentMobile?: boolean
  outerHeader?: boolean
}
// #endregion props

const props = withDefaults(defineProps<Props>(), {
  collapsable: false,
  closeHint: false,
  visible: true,
})

const emit = defineEmits<{
  (e:
    'update:visible'
    | 'update:collapsed'
    | 'update:closeHint',
    value: boolean
  ): void
  (e: 'overlayClick'): void
  (e: 'close'): void
}>()

const isFloating = computed(() => props.floating || props.float)
const isCollapsed = ref(props.collapsed)

const body = ref<Element & { offsetHeight: number }>()

const reachedEnd = ref(true)

const updateScroll = () => {
  const { value: bodyElem } = body
  reachedEnd.value = bodyElem
    ? bodyElem.scrollTop + bodyElem.offsetHeight! >= bodyElem.scrollHeight
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
      data-component="box"
      :class="`
        box__content
        ${!(isFloating || fixedRight) && 'box__content--bordered'}
        ${isFloating && 'box__content--floating'}
        ${fixedRight && 'box__content--fixed-right'}
        ${transparent && 'box__content--transparent'}
        ${transparentMobile && 'box__content--transparent-mobile'}
        ${outerHeader && 'box__content--outer-header'}
      `"
      @click="$event.stopPropagation()"
    >
      <!-- box head -->
      <div
        v-if="$slots.header || title"
        :class="`
          box__header
          ${isCollapsed && 'box__header--collapsed'}
          ${outerHeader && 'box__header--outer'}
      `">
        <div class="box__header-left">
          <slot v-if="$slots.header" name="header"></slot>
          <div v-else-if="title">{{ title }}</div>
          <div
            v-if="$slots.extra"
            style="margin-left: auto"
          >
            <slot name="extra"></slot>
          </div>
        </div>

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

<style scoped src="./sv-box.scss"></style>
