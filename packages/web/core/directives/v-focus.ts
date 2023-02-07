import { Directive } from 'vue'

const focus: Directive = {
  mounted(el, binding) {
    if( binding.value ) {
      el.focus()
    }
  }
}

export default focus
