import type { Directive } from 'vue'

export default {
  mounted: (el, binding) => {
    if( window.matchMedia('(min-width: 600px)').matches ) {
      const style = binding.value?.blocked
        ? 'cursor: not-allowed;'
        : 'cursor: pointer;'

      el.setAttribute('style', style)
    }
  }
} as Directive
