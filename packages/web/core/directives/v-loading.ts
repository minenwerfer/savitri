import type { Directive, DirectiveBinding } from 'vue'

const update = (el: HTMLElement, binding: DirectiveBinding) => {
  el.ariaBusy = el.getAttribute('aria-busy')

  if( !binding.value ) {
    if( el.ariaBusy ) {
      el.removeAttribute('aria-busy')
      el.removeAttribute('style')
      el.children[el.children.length-1].remove()
    }
    return
  }

  if( el.ariaBusy ) {
    return
  }

  if( !el.parentNode ) {
    throw new Error('make sure a parent node exists when casting v-loading')
  }

  const overlayElem = document.createElement('div')
  overlayElem.setAttribute('style', `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    display: grid;
    place-items: center;

    background: rgba(240, 240, 240, .8);
  `)

  overlayElem.innerHTML = 'Carregando...'
  el.setAttribute('style', `
    position: relative;
    cursor: wait;
  `)

  el.setAttribute('aria-busy', 'true')
  el.appendChild(overlayElem)
}

const loading: Directive = {
  mounted: update,
  updated: update

}

export default loading
