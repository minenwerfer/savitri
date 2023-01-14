import type { Directive } from 'vue'
import { cloneVNode } from 'vue'
import { useStore } from '@savitri/web'

export default {
  mounted: (el, binding, vnode) => {
    if( vnode.props?._detached ) {
      return
    }

    const uid = (<any>vnode).ctx.uid + (binding.value?.identifier||'')
    const metaStore = useStore('meta')
    const subject = metaStore.detached[uid] = {
      vnode: cloneVNode(vnode, {
        uid,
        closeHint: false
      }),
      binding,
      visible: false
    }

    const detachHint = document.createElement('div')
    detachHint.innerHTML = 'xx'
    detachHint.onclick = () => {
      metaStore.detachedItr = Math.random() + uid
      metaStore.detachedStack.unshift(uid)
      subject.visible = true
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

    const uid = (<any>vnode).ctx.uid + (binding.value?.identifier||'')
    const metaStore = useStore('meta')

    metaStore.detached[uid] ??= {}
    metaStore.detached[uid].binding = binding || (<any>vnode).ctx.props
    metaStore.detached[uid].vnode = cloneVNode(vnode, {
      uid,
      closeHint: false,
      binding
    })
  }

} as Directive
