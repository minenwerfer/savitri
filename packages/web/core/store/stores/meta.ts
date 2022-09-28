import { defineStore } from 'pinia'
import { default as webpackVariables } from 'variables'
import { CollectionDescription } from '../../../../common/types'
import { freshItem } from '../../helpers/store'
import useHttp from '../../http'
import useCollection from '../collection'

import { useStore, hasStore, registerStore } from '../use'
import { hydrateQuery } from '../helpers'

type CollectionName = string
type PromptAnswer = { name: string }

const { http } = useHttp()

export default defineStore('meta', {
  state: () => ({
    descriptions: [],
    roles: {},

    isLoading: false,
    globalIsLoading: false,
    theme: '',

    view: {
      title: '',
      layout: 'tabular',
      collection: ''
    },
    menu: {
      isVisible: true,
      isMobileVisible: false
    },
    modal: {
      isVisible: false,
      title: '',
      body: '',
      image: '',
      component: '',
      details: {}
    },
    prompt: {
      isVisible: false,
      title: '',
      body: '',
      actions: [],
    },
    toasts: [],
  }),

  actions: {
    async describeAll() {
      this.isLoading = true
      const response = await http.get('_/meta/describeAll')
      const descriptions: Record<CollectionName, CollectionDescription> =
        this.descriptions = response.data.result.descriptions

      this.roles = response.data.result.roles

      // monkeypatchs '@savitri/web/stores' object
      for ( const [collectionName, description] of Object.entries(descriptions) ) {
        const rawDescription = Object.assign({}, description)
        const item = freshItem(description)

        description.fields = await hydrateQuery(description.fields, false)

        if( hasStore(collectionName) ) {
          const store = useStore(collectionName)
          store.$patch({
            item,
            freshItem: Object.assign({}, item),
            description,
            rawDescription
          })
          continue
        }

        const {
          state,
          actions,
          getters
        } = useCollection()

        const store = defineStore(collectionName, {
          state: () => Object.assign(state(), {
            item,
            freshItem: Object.assign({}, item),
            description,
            rawDescription
          }),

          actions,
          getters
        })

        registerStore(store)
      }

      this.isLoading = false
    },

    swapMenu() {
      this.menu.isVisible = !this.menu.isVisible
      localStorage.setItem('meta:menu:isVisible', String(this.menu.isVisible))
    },

    spawnPrompt(props: {
      title?: string
      body?: string
      actions: Array<{
        name: string
        title: string
        size?: string
        variant?: string
      }>
    }): Promise<PromptAnswer> {
      this.$patch({
        prompt: {
          ...props,
          isVisible: true
        } as any
      })

      return new Promise((resolve) => {
        const event = ({ detail }: any) => {
          window.removeEventListener('__prompt', event)
          this.prompt.isVisible = false
          resolve(detail.option)
        }

        window.addEventListener('__prompt', event)
      })
    },

    fulfillPrompt(answer: PromptAnswer) {
      window.dispatchEvent(new CustomEvent('__prompt', {
        detail: { option: answer }
      }))
    },

    spawnModal(props: Omit<typeof this['modal'], 'isVisible'>) {
      this.$patch({
        modal: {
          ...props,
          isVisible: true
        }
      })
    },

    spawnToast(
      this: { toasts: Array<any> },
      props: {
        text: string
        icon?: string
      }
    ) {
      this.toasts.push({
        ...props,
        itr: this.toasts.length
      })
    },

    popToast(this: { toasts: Array<any> }) {
      this.toasts.shift()
    },

    saveTheme() {
      localStorage.setItem('meta:theme', this.theme)
    },
  },

  getters: {
    $theme(): string {
      if( !this.theme ) {
        const defaultTheme = webpackVariables.defaultTheme || 'default'
        this.theme = localStorage.getItem('meta:theme') || defaultTheme
      }

      return this.theme
    }
  }
})
