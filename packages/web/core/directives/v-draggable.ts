import type { Directive } from 'vue'
import { useStore } from '../state/use'

const makeHint = (pos: number, style?: string) => {
  const size = 2;
  const hint = document.createElement('div')

  hint.setAttribute('style', `
    position: absolute;
    top: ${size*pos}rem;
    left: -${size}rem;
    color: #fff;
    user-select: none;
    cursor: pointer;

    border-radius: 50% 0 0 50%;
    width: ${size}rem;
    height: ${size}rem;

    ${style||''}
  `)

  return hint
}

export default {
  mounted: (el, _binding, vnode) => {
    const coords = {
      active: false,
      initialX: 0,
      initialY: 0,
      currentX: 0,
      currentY: 0,
      offsetX: 0,
      offsetY: 0
    }

    const uid = vnode.props?.uid
    const metaStore = useStore('meta')

    const container = el.parentNode
    if( !container ) {
      throw new Error('make sure a parent node exists when casting v-draggable')
    }

    container.setAttribute('style', `
      position: fixed;
      top: 20rem;
      left: 20rem;
    `)

    const dragHint = makeHint(0, 'background: blue; cursor: grab')
    const shrinkHint = makeHint(1, 'background: yellow')
    const closeHint = makeHint(2, 'background: red')

    closeHint.onclick = () => {
      metaStore.detached[uid].visible = false
      if( metaStore.detachedStack[0] === uid ) {
        metaStore.detachedStack.shift()
      }
    }

    shrinkHint.onclick = () => {
      metaStore.detached[uid].visible = 'shrink'
    }

    el.insertBefore(dragHint, el.firstChild)
    el.insertBefore(closeHint, el.firstChild)
    el.insertBefore(shrinkHint, el.firstChild)

    const dragStart = (e: MouseEvent) => {
      coords.initialX = e.clientX - coords.offsetX
      coords.initialY = e.clientY - coords.offsetY

      if( e.target === dragHint ) {
        dragHint.style.cursor = 'grabbing'
        coords.active = true
      }
    }

    const dragEnd = () => {
      coords.initialX = coords.currentX
      coords.initialY = coords.currentY

      dragHint.style.cursor = 'grab'
      coords.active = false
    }

    const drag = (e: MouseEvent) => {
      if( !coords.active ) {
        return
      }

      coords.offsetX = coords.currentX = e.clientX - coords.initialX
      coords.offsetY = coords.currentY = e.clientY - coords.initialY

      container.style.transform = `translate3d(${coords.currentX}px, ${coords.currentY}px, 0)`
    }

    document.addEventListener('mousemove', drag)
    document.addEventListener('mousedown', dragStart)
    document.addEventListener('mouseup', dragEnd)
  },
} as Directive
