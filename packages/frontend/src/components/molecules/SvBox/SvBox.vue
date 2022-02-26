<template>
  <div v-if="visible" :class="`${ isFloating && 'absolute z-40' } ${ animate ? 'animate-fade' : '' }`">
    <sv-overlay v-if="isFloating"></sv-overlay>
    <div :class="`${ isFloating ? 'fixed inset-0 z-50 flex justify-center items-center' : ''}`">
      <div
        @click="$event.stopPropagation()"
        :class="`
          ${
            isFloating
              ? 'w-full h-full sm:w-3/4 md:w-3/5 lg:w-5/12 sm:h-auto sm:min-h-[30vh] z-10 max-h-screen md:max-h-[95vh]'
              : ''
          }
          ${ isFloating && animate ? 'animate-toast' : '' }
          ${ isFloating ? '' : ( fullWidth || fill ? '' : 'py-4 px-auto' ) }
          ${ fullWidth ? 'w-screen md:w-auto centered-fullwidth' : `rounded shadow` }
          flex flex-col ${ transparent || 'bg-white' } overscroll-none
          ${ classes }
        `"
      >
      <div :class="`flex ${isFloating && 'border-b py-4 px-auto bg-gray-50'}`" v-if="$slots.title || title">
          <div class="flex-1 font-semibold text-xl">
            <slot v-if="$slots.title" name="title"></slot>
            <div v-else-if="title">{{ title }}</div>
          </div>
          <div v-if="closeHint || collapsable">
            <sv-bare-button v-if="collapsable" @click="isCollapsed = !isCollapsed">
              <unicon :name="!isCollapsed ? 'minus' : 'plus'" />
            </sv-bare-button>
            <sv-bare-button v-else-if="closeHint" @click="$emit('close')">
              <unicon name="multiply" />
            </sv-bare-button>
          </div>
        </div>

        <div v-if="!isCollapsed" :class="`overflow-x-hidden overflow-y-auto flex-grow ${ (($slots.title || title) && !isCollapsed) && 'pt-4' } ${isFloating && 'px-auto'} ${(isFloating || $slots.footer) && 'pb-6'}`">
          <slot v-if="$slots.default"></slot>
          <slot v-else name="body"></slot>
        </div>

        <div :class="`self-end ${isFloating && 'px-auto pb-4'}`" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { SvBareButton, SvOverlay } from 'frontend/components'

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

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all .15s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.centered-fullwidth {
  position: relative;
  left: 0;
}
</style>
