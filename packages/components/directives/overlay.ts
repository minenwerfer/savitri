import type { Directive } from 'vue'

export default {
  mounted: (el, binding) => {
    if( binding.value?.condition === false ) {
      return
    }

    if( !el.parentNode ) {
      throw new Error('make sure a parent node exists when casting v-overlay')
    }

    const overlayElem = document.createElement('div')
    overlayElem.setAttribute('style', `
      position: fixed;
      display: block;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 50;

      width: 100vw;
      height: 100vh;

      ${!binding.modifiers?.invisible && `
        background: #555;
        opacity: .6;
      `}
    `)

    if( binding.value?.click ) {
      overlayElem.onclick = binding.value.click
    }

    el.setAttribute('style', 'z-index: 60;')
    el.parentNode.insertBefore(overlayElem, el)
  },

  beforeUnmount: (el, binding) => {
    if( binding.value?.condition === false ) {
      return
    }

    el.previousElementSibling?.remove()
  }
} as Directive
