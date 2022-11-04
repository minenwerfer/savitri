import type { Directive } from 'vue'

export default {
  mounted: (el: HTMLDivElement, binding) => {
    if( window.matchMedia('(min-width: 600px)').matches ) {
      const cursor = binding.value?.blocked
        ? 'not-allowed'
        : 'pointer'

      el.style.cursor = cursor
    }
  }
} as Directive
