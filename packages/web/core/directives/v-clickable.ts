import type { Directive } from 'vue'

export default {
  mounted: (el, binding) => {
    if( window.matchMedia('(min-width: 600px)').matches ) {
      const cursor = binding.value?.blocked
        ? 'not-allowed'
        : 'pointer'

      el.style.cursor = cursor
      el.style['user-select'] = 'none'
    }
  }
} as Directive
