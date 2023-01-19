import type { Directive } from 'vue'
import { cloneVNode } from 'vue'
import { useStore, DetachedComponent } from '../..'

export default {
  mounted: (el, binding, vnode) => {
    if( vnode.props?._detached ) {
      return
    }

    const uid = binding.arg || (<any>vnode).ctx.uid
    const metaStore = useStore('meta')

    metaStore.detached[uid] ??= {
      vnode: cloneVNode(vnode, {
        uid,
        closeHint: false
      }),
      title: binding.value?.title,
      description: binding.value?.description,
      route: ROUTER.currentRoute.value.fullPath,
      visible: metaStore.detached[uid]?.visible || false,
      identifier: binding.arg as string
    }

    const subject: DetachedComponent = metaStore.detached[uid]
    const detachHint = document.createElement('div')
    detachHint.innerHTML = 'xx'
    detachHint.onclick = async () => {
      if( subject.visible !== 'shrink' ) {
        if( binding.arg ) {
          const savedItem = useStore('savedItem')
          const item = await savedItem.functions.subscribe({
            title: binding.value?.title,
            description: binding.value?.description,
            route: subject.route,
            identifier: binding.arg

          } as Omit<DetachedComponent, 'vnode'>)

          Object.assign(metaStore.detached[uid], item)
        }

        metaStore.detachedItr = Math.random() + uid
        metaStore.detachedStack.unshift(uid)
        subject.visible = 'shrink'
      }
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

    const uid = binding.arg || (<any>vnode).ctx.uid
    const metaStore = useStore('meta')

    metaStore.detached[uid] ??= {}
    metaStore.detached[uid].identifier = binding.arg
    metaStore.detached[uid].vnode = cloneVNode(vnode, {
      uid,
      closeHint: false,
    })
  }

} as Directive
