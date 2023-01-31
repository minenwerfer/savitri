import type { Directive } from 'vue'
import { useStore } from '../..'

export type Subscription = {
  _id?: string
  visible: boolean|'shrink'
  route: string
  identifier: string
  title?: string
  description?: string
}


export default {
  mounted: (el, binding, vnode) => {
    if( vnode.props?._subscribeed ) {
      return
    }

    const identifier = binding.arg || binding.value.identifier
    const subscribeHint = document.createElement('div')

    subscribeHint.innerHTML = 'xx'
    subscribeHint.onclick = async () => {
      const subscription = useStore('subscription')
      subscription.functions.subscribe({
        title: binding.value?.title,
        description: binding.value?.description,
        route: ROUTER.currentRoute.value.fullPath,
        identifier

      } as Subscription)
    }

    subscribeHint.setAttribute('style', `
      position: absolute;
      top: 0;
      right: 0;
      background: #fff;
      cursor: pointer;
    `)

    el.style.position = 'relative'
    el.appendChild(subscribeHint)
  },

} as Directive
