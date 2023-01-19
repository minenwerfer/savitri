import { Directive, watch } from 'vue'
import { useStore } from '../state/use'
import Overlay from './v-overlay'
import Clickable from './v-clickable'

type WizardOptions = {
  text: string
  step: number
  version: string
  last?: boolean
}

const {
  mounted: castOverlay,
  beforeUnmount: _destroyOverlay

} = Overlay as any

const { mounted: clickable } = Clickable as any
const destroyOverlay = (el: HTMLDivElement) => _destroyOverlay(el, { condition: false })

const getQuadrant = (el: HTMLDivElement) => {
  const styles = []
  const rect = el.getBoundingClientRect()
  const coords = {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
    bottom: rect.bottom + window.scrollY,
    right: rect.right + window.scrollX,
  }

  const {
    height: windowHeight,
    width: windowWidth

  } = window.visualViewport!

  styles.push(
    (coords.top - windowHeight/2) < (windowHeight/2 - coords.bottom)
      ? `top: calc(${coords.bottom}px + 15px);`
      : `bottom: calc(${windowHeight - coords.top}px + 15px);`
  )

  styles.push(
    (coords.left - windowWidth/2) < (windowWidth/2 - coords.right)
      ? `left: ${coords.left}px;`
      : `right: ${windowWidth - coords.right}px;`
  )

  return styles.join('')
}

export default {
  mounted: (el, binding) => {
    const options: WizardOptions = binding.value

    const metaStore = useStore('meta')
    const userStore = useStore('user')

    watch(() => metaStore.wizard.step, () => {
      if(
        userStore.$currentUser.wizard_versions?.includes(options.version)
        || metaStore.wizard.current && metaStore.wizard.current !== options.version
        || metaStore.wizard.step !== options.step
      ) {
        return
      }

      castOverlay(el, {})
      metaStore.wizard.current = options.version

      const buttonElem = document.createElement('button')
      buttonElem.innerText = 'Ok!'
      buttonElem.setAttribute('style', `
        padding: .6rem 1rem;
        border-radius: 5px;
        color: #fff;
        background: green;
        outline: 0;
      `)

      clickable(buttonElem, {})

      const textElem = document.createElement('div')
      textElem.innerHTML = options.text

      const overlayElem = document.createElement('div')
      overlayElem.onclick = (e) => e.stopPropagation()
      overlayElem.setAttribute('style', `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 40;
      `)

      const wizardElem = document.createElement('div')
      wizardElem.setAttribute('aria-role', 'wizard')
      wizardElem.setAttribute('style', `
        all: initial;
        position: absolute;
        ${getQuadrant(el)}

        min-width: 15rem;
        max-width: 30rem;
        overflow: visible;
        z-index: 100;

        padding: 1rem;
        border-radius: 10px;
        background: #fff;

        display: flex;
        flex-direction: column;
        align-items: start;
        gap: 1rem;
      `)

      const fulfill = async () => {
        metaStore.wizard.step += 1
        wizardElem.remove()
        overlayElem.remove()

        destroyOverlay(el)
        el.click()

        if( options.last ) {
          userStore.currentUser = Object.assign({}, userStore.$currentUser)
          userStore.currentUser.wizard_versions ??= []
          userStore.currentUser.wizard_versions.push(options.version)

           await userStore.insert({
             what: {
               _id: userStore.currentUser._id,
               wizard_versions: userStore.currentUser.wizard_versions
             }
           })
          
          sessionStorage.setItem('auth:currentUser', JSON.stringify(userStore.currentUser))
          metaStore.wizard.current = ''
          metaStore.wizard.step = 1
        }
      }

      buttonElem.addEventListener('click', fulfill)
      wizardElem.appendChild(textElem)
      wizardElem.appendChild(buttonElem)

      el.appendChild(overlayElem)
      document.body.appendChild(wizardElem)

    }, { immediate: true })
  }
} as Directive
