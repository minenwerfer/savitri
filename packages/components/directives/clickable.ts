import type { Directive } from 'vue'

export default {
  mounted: (el) => {
    if( window.matchMedia('(min-width: 600px)').matches ) {
      el.setAttribute('style', 'cursor: pointer;')
    }
  }
} as Directive
