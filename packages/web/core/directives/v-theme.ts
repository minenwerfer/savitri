import { Directive } from 'vue'
import { useStore } from '../state'

const theme: Directive = {
  mounted(_, binding) {
    useStore('meta').themeOverride = binding.arg
  },
  unmounted() {
    useStore('meta').themeOverride = ''
  }
}

export default theme
