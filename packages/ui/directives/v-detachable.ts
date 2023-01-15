import type { Directive } from 'vue'
import { cloneVNode } from 'vue'
import { useStore, DetachedComponent } from '../../web'

export default {
  mounted: (el, binding, vnode) => {
    if( vnode.props?._detached ) {
      return
    }

    const uid = (<any>vnode).ctx.uid
    const metaStore = useStore('meta')
    const subject: DetachedComponent = metaStore.detached[uid] = {
      vnode: cloneVNode(vnode, {
        uid,
        closeHint: false
      }),
      binding: binding.value,
      route: ROUTER.currentRoute.value.fullPath,
      visible: false
    }

    const detachHint = document.createElement('div')
    detachHint.innerHTML = 'xx'
    detachHint.onclick = () => {
      metaStore.detachedItr = Math.random() + uid
      metaStore.detachedStack.unshift(uid)
      subject.visible = 'shrink'

      useStore('user').functions.savePage({
        route: subject.route,
        visible: 'shrink'

      } as DetachedComponent)
    }

    detachHint.setAttribute('style', `
      position: absolute;
      top: 0;
      right: 0;
      background: #fff;
      cursor: pointer;
    `)

    el.style.position = 'relative'
    el.appendChild(detachHint)
  },

  updated: (_el, binding, vnode) => {
    if( vnode.props?._detached ) {
      return
    }

    const uid = (<any>vnode).ctx.uid
    const metaStore = useStore('meta')

    metaStore.detached[uid] ??= {}
    metaStore.detached[uid].binding = binding.value || (<any>vnode).ctx.props
    metaStore.detached[uid].vnode = cloneVNode(vnode, {
      uid,
      closeHint: false,
    })
  }

} as Directive
