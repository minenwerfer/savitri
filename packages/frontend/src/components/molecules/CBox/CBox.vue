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
          ${ fullWidth ? 'w-screen md:w-view centered-fullwidth' : 'rounded-lg shadow-md py-4 md:py-5' }
          flex flex-col bg-white py-0
        `"
      >
        <div :class="`flex ${ typeof marginBottom === 'number' ? `mb-${marginBottom}` : 'mb-8 md:mb-10' }`" v-if="$slots.title || title">
          <div class="flex-1 font-semibold text-xl">
            <slot v-if="$slots.title" name="title"></slot>
            <div v-else-if="title">{{ title }}</div>
          </div>
          <c-bare-button v-if="closeHint || collapsable">
            <i v-if="collapsable" @click="isCollapsed = !isCollapsed">[A]</i>
            <unicon v-else-if="closeHint && isFloating" @click="$emit('close')" name="multiply" />
          </c-bare-button>
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

<script>
import { computed, ref } from 'vue'
import { CBareButton } from 'frontend/components'

export default {
  props: {
    title: {
      type: String,
      required: false
    },
    closeHint: {
      type: Boolean,
      default: true,
    },
    float: {
      type: Boolean,
      default: false,
    },
    floating: {
      type: Boolean,
      default: false
    },
    collapsed: {
      type: Boolean,
      default: false,
    },
    visible: {
      type: Boolean,
      default: true,
    },
    collapsable: {
      type: Boolean,
      default: false,
    },
    animate: {
      type: Boolean,
      default: true,
    },
    marginBottom: {
      type: Number,
      required: false
    },
    fullWidth: {
      type: Boolean,
      default: false
    },
  },

  components: {
    CBareButton,
  },

  setup(props) {
    return {
      isFloating: computed(() => props.floating || props.float),
      isCollapsed: ref(props.collapsed)
    }
  },
}
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
  position: absolute;
  top: 0;
  left: 0;
}
</style>
