import type { Directive } from 'vue'

const __layer = {
  last: 50
}

export default {
  mounted: (el, binding) => {
    if( binding.value?.condition === false ) {
      return
    }

    if( !el.parentNode ) {
      throw new Error('make sure a parent node exists when casting v-overlay')
    }

    const overlayElem = document.createElement('div')
    const zIndex = __layer.last

    __layer.last += 10

    overlayElem.setAttribute('style', `
      position: fixed;
      display: block;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: ${zIndex};

      width: 100vw;
      height: 100vh;

      ${!binding.modifiers?.invisible && `
        background: rgba(65, 82, 105, .25);
      `}
    `)

    if( binding.value?.click ) {
      overlayElem.onclick = binding.value.click
    }

    el.setAttribute('style', `z-index: ${zIndex+10};`)
    el.parentNode.insertBefore(overlayElem, el)
  },

  beforeUnmount: (el, binding) => {
    if( binding.value?.condition === false ) {
      return
    }

    el.previousElementSibling?.remove()
    __layer.last -= 10
  }
} as Directive
