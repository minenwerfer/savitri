import { Directive } from 'vue'

export default {
  mounted(el, binding) {
    if( binding.value ) {
      el.focus()
    }
  }
} as Directive
