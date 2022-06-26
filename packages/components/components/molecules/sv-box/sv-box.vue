<template>
  <div v-if="visible" :class="`box ${isFloating && 'box--floating'}`">
    <sv-overlay v-if="isFloating"></sv-overlay>
    <div :class="`${ isFloating ? 'fixed inset-0 z-50 flex justify-center items-center' : ''}`">
      <div
        @click="$event.stopPropagation()"
        :class="`
          ${
            isFloating
              ? 'w-11/12 min-h-48 md:w-4/5 lg:w-[50em] sm:h-auto sm:min-h-[30vh] z-10 max-h-screen md:max-h-[95vh]'
              : ''
          }
          ${ isFloating && animate ? 'ease-out animate-grow' : '' }
          ${ isFloating || ( fullWidth || fill ? '' : 'py-4 px-auto' ) }
          ${ fullWidth ? 'w-screen md:w-auto centered-fullwidth' : `rounded-lg border` }
          flex flex-col ${ transparent || 'bg-white' } overflow-y-hidden overscroll-none
          ${ classes }
        `"
      >
      <div :class="`flex items-center bg-gray-50 ${isFloating && 'border-b py-3 px-4'}`" v-if="$slots.title || title">
          <div class="flex-1 font-semibold text-xl">
            <slot v-if="$slots.title" name="title"></slot>
            <div v-else-if="title">{{ title }}</div>
          </div>
          <div v-if="closeHint || collapsable">
            <sv-bare-button v-if="collapsable" @click="isCollapsed = !isCollapsed">
              <sv-icon :name="!isCollapsed ? 'minus' : 'plus'" :reactive="true" />
            </sv-bare-button>
            <sv-bare-button v-else-if="closeHint" @click="$emit('close')">
              <sv-icon name="multiply" :reactive="true" />
            </sv-bare-button>
          </div>
        </div>

        <div v-if="!isCollapsed" :class="`${ isFloating && 'overflow-y-auto' } flex-grow ${ (($slots.title || title) && !isCollapsed) && 'pt-4' } ${isFloating && 'px-auto'} ${(isFloating || $slots.footer) && 'pb-6'}`">
          <slot v-if="$slots.default"></slot>
          <slot v-else name="body"></slot>
        </div>

        <div :class="`flex gap-x-2 ${isFloating && 'px-auto pb-4'}`" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>
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

const props = defineProps({
  closeHint: {
    type: Boolean,
    default: true
  },
  visible: {
    type: Boolean,
    default: true
  },
  animate: {
    type: Boolean,
    default: true
  },
  title: String,
  float: Boolean,
  floating: Boolean,
  collapsed: Boolean,
  collapsable: Boolean,
  fullWidth: Boolean,
  classes: String,
  paddingY: {
    type: String,
    default: 'py-4 md:py-5'
  },
  fill: Boolean,
  transparent: Boolean
})

const isFloating = computed(() => props.floating || props.float)
const isCollapsed = ref(props.collapsed)
</script>

<style scoped="./sv-box.scss"></style>
