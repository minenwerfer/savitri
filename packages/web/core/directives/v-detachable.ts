import type { Directive } from 'vue'
import { useStore, DetachedComponent } from '../..'

export default {
  mounted: (el, binding, vnode) => {
    if( vnode.props?._detached ) {
      return
    }

    const identifier = binding.arg || binding.value.identifier
    // const metaStore = useStore('meta')

    // metaStore.detached[uid] ??= {
    //   vnode: cloneVNode(vnode, {
    //     uid,
    //     closeHint: false
    //   }),
    //   title: binding.value?.title,
    //   description: binding.value?.description,
    //   route: ROUTER.currentRoute.value.fullPath,
    //   visible: metaStore.detached[uid]?.visible || false,
    //   identifier
    // }

    // const subject: DetachedComponent = metaStore.detached[uid]
    const detachHint = document.createElement('div')

    detachHint.innerHTML = 'xx'
    detachHint.onclick = async () => {
      // if( subject.visible !== 'shrink' ) {
      const subscription = useStore('subscription')
      subscription.functions.subscribe({
        title: binding.value?.title,
        description: binding.value?.description,
        route: ROUTER.currentRoute.value.fullPath,
        identifier

      } as Omit<DetachedComponent, 'vnode'>)

          // Object.assign(metaStore.detached[uid], item)

        // metaStore.detachedItr = Math.random() + uid
        // metaStore.detachedStack.unshift(uid)
        // subject.visible = 'shrink'
      // }
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

  // updated: (_el, binding, vnode) => {
  //   if( vnode.props?._detached ) {
  //     return
  //   }

  //   const uid = binding.arg || (<any>vnode).ctx.uid
  //   const metaStore = useStore('meta')

  //   metaStore.detached[uid] ??= {}
  //   metaStore.detached[uid].identifier = binding.arg
  //   metaStore.detached[uid].vnode = cloneVNode(vnode, {
  //     uid,
  //     closeHint: false,
  //   })
  // }

} as Directive
