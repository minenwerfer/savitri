import { Directive } from 'vue'
import { useStore } from '../state'

export default {
  mounted(_, binding) {
    useStore('meta').themeOverride = binding.arg
  },
  unmounted() {
    useStore('meta').themeOverride = ''
  }
} as Directive
