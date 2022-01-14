<template>
  <div v-if="visible" :class="`${ isFloating ? 'absolute z-50' : 'mb-3' } ${ animate ? 'animate-fade' : '' }`" @click="$emit('close')">
    <div v-if="isFloating" class="fixed inset-0 bg-gray-900 opacity-60"></div>
    <div :class="`${ isFloating ? 'fixed inset-0 flex justify-center items-center' : ''}`">
      <div
        @click="$event.stopPropagation()"
        :class="`
          ${
            isFloating
              ? 'w-full h-full sm:w-3/4 md:w-3/5 lg:w-5/12 sm:h-auto sm:min-h-modal z-10 max-h-screen md:max-h-modal'
              : ''
          }
          ${ isFloating && animate ? 'animate-toast' : '' }
          ${ isFloating ? 'px-4 md:px-6' : ( fullWidth ? '' : 'px-auto' ) }
          ${ fullWidth ? 'w-screen md:w-view centered-fullwidth' : 'rounded-lg shadow py-4 md:py-5' }
          flex flex-col bg-white py-0
          ${ classes }
        `"
      >
        <div :class="`flex ${ typeof marginBottom === 'number' ? `mb-${marginBottom}` : 'mb-8 md:mb-10' }`" v-if="$slots.title || title">
          <div class="flex-1 font-semibold text-xl">
            <slot v-if="$slots.title" name="title"></slot>
            <div v-else-if="title">{{ title }}</div>
          </div>
          <sv-bare-button v-if="closeHint || collapsable">
            <i v-if="collapsable" @click="isCollapsed = !isCollapsed">[A]</i>
            <unicon v-else-if="closeHint && isFloating" @click="$emit('close')" name="multiply" />
          </sv-bare-button>
        </div>

        <div v-if="!isCollapsed" :class="`overflow-auto flex-grow ${$slots.footer ? 'border-b pb-5' : ''}`">
          <slot v-if="$slots.default"></slot>
          <slot v-else name="body"></slot>
        </div>

        <div class="self-end mt-2" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { SvBareButton } from 'frontend/components'

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
  marginBottom: Boolean,
  fullWidth: Boolean,
  classes: String,
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
