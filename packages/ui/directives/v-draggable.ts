import type { Directive } from 'vue'
import { useStore } from '@savitri/web'

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

    const uid = (<any>vnode).ctx.uid
    const metaStore = useStore('meta')

    const container = el.parentNode
    if( !container ) {
      throw new Error('make sure a parent node exists when casting v-draggable')
    }

    container.setAttribute('style', `
      position: fixed;
      top: 20rem;
      left: 20rem;
      background: var(--${metaStore.theme}-background-color);
    `)

    const dragHint = document.createElement('div')
    dragHint.innerHTML = 'oi'
    dragHint.setAttribute('style', `
      position: absolute;
      top: 0;
      left: -2.5rem;
      background: #0000ff;
      color: #fff;
      user-select: none;
      cursor: move;

      border-radius: 50% 0 0 50%;
      width: 2.5rem;
      height: 2.5rem;
    `)

    const closeHint = document.createElement('div')
    closeHint.innerHTML = 'oi'
    closeHint.setAttribute('style', `
      position: absolute;
      top: 2.5rem;
      left: -2.5rem;
      background: #ff0000;
      color: #fff;
      user-select: none;
      cursor: pointer;

      border-radius: 50% 0 0 50%;
      width: 2.5rem;
      height: 2.5rem;
    `)

    const shrinkHint = document.createElement('div')
    shrinkHint.innerHTML = 'oi'
    shrinkHint.setAttribute('style', `
      position: absolute;
      top: 5rem;
      left: -2.5rem;
      background: #00ff00;
      color: #fff;
      user-select: none;
      cursor: pointer;

      border-radius: 50% 0 0 50%;
      width: 2.5rem;
      height: 2.5rem;
    `)

    closeHint.onclick = () => {
      metaStore.detached[uid].visible = false
    }

    shrinkHint.onclick = () => {
      metaStore.detached[uid].visible = 'shrink'
    }

    el.insertBefore(dragHint, el.firstChild)
    el.insertBefore(closeHint, el.firstChild)
    el.insertBefore(shrinkHint, el.firstChild)

    const dragStart = (e) => {
      coords.initialX = e.clientX - coords.offsetX
      coords.initialY = e.clientY - coords.offsetY

      if( e.target === dragHint ) {
        coords.active = true
      }
    }

    const dragEnd = () => {
      coords.initialX = coords.currentX
      coords.initialY = coords.currentY

      coords.active = false
    }

    const drag = (e) => {
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
